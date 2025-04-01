import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import Headers from "./Headers";

type Route = {
  route_id: string;
  route_short_name: string;
  route_long_name: string;
  route_color: string;
};

type Stop = {
  stop_id: string;
  stop_code: string;
  stop_name: string;
  stop_desc: string;
  stop_lat: number;
  stop_lon: number;
  location_type: string;
  wheelchair_boarding: string;
};

type Trip = {
  route_id: string;
  service_id: string;
  trip_id: string;
  trip_headsign: string;
  trip_short_name: string;
  direction_id: string;
  block_id: string;
  shape_id: string;
  wheelchair_accessible: string;
  bikes_allowed: string;
};

type LngLat = [number, number];
type Shape = {
  shape_id: string;
  shape_pt_lat: string;
  shape_pt_lon: string;
};

type StopTime = {
  trip_id: string;
  arrival_time: string;
  departure_time: string;
  stop_id: string;
  stop_sequence: string;
  stop_headsight: string;
  pickup_type: string;
  drop_off_type: string;
  timepoint: string;
};

class _GTFSLoader {
  #routes: { [key: string]: Route } = {};
  #stops: { [key: string]: Stop } = {};
  #stopTimes: { [key: string]: StopTime[] } = {};
  #trips: { [key: string]: Trip } = {};
  #shapes: { [key: string]: LngLat[] } = {};
  constructor() {
    this.loadData();
  }

  public loadData() {
    const routesPath = path.join(__dirname + "/routes.txt");
    const stopsPath = path.join(__dirname + "/stops.txt");
    const stopTimesPath = path.join(__dirname + "/stop_times.txt");
    const tripsPath = path.join(__dirname + "/trips.txt");
    const shapesPath = path.join(__dirname + "/shapes.txt");

    // Populate Routes Lookup
    fs.createReadStream(routesPath)
      .pipe(
        csvParser({
          headers: Headers["routes"],
          skipLines: 1,
        })
      )
      .on("data", (row: Route) => (this.#routes[row.route_id] = row));

    // Populate Stops Lookup
    fs.createReadStream(stopsPath)
      .pipe(
        csvParser({
          headers: Headers["stops"],
          skipLines: 1,
        })
      )
      .on("data", (row: Stop) => {
        this.#stops[row.stop_id] = row;
        this.#stops[row.stop_id].stop_lat = Number(this.#stops[row.stop_id].stop_lat);
        this.#stops[row.stop_id].stop_lon = Number(this.#stops[row.stop_id].stop_lon);
      });
    // Populate Trips Lookup
    fs.createReadStream(tripsPath)
      .pipe(
        csvParser({
          headers: Headers["trips"],
          skipLines: 1,
        })
      )
      .on("data", (row: Trip) => {
        this.#trips[row.trip_id] = row;
      });
    // Populate Shapes Lookup
    fs.createReadStream(shapesPath)
      .pipe(csvParser({}))
      .on("data", (row: Shape) => {
        if (!this.#shapes[row.shape_id])
          this.#shapes[row.shape_id] = new Array();
        this.#shapes[row.shape_id].push([
          parseFloat(row.shape_pt_lon),
          parseFloat(row.shape_pt_lat),
        ]);
      });
    // Populate Stop Times Lookup
    fs.createReadStream(stopTimesPath)
      .pipe(
        csvParser({
          // skipLines: 1,
        })
      )
      .on("data", (row: StopTime) => {
        if (!this.#stopTimes[row.trip_id])
          this.#stopTimes[row.trip_id] = new Array();
        this.#stopTimes[row.trip_id].push(row);
      });
  }

  // Getters for Bus Route data
  public getRoutes() {
    return this.#routes;
  }

  public getRouteById(id: string) {
    // In this Method, We can include stops for the route using routes => trips => stopTimes => stops mapping.
    // Maybe seperate info for stops and shape
    const routeData = this.#routes[id];
    if (!routeData) return {};

    return this.#routes[id] ?? {};
  }

  // Getters for Bus Stops data
  public getStops() {
    return this.#stops;
  }

  public getStopById(id: string) {
    return this.#stops[id] ?? {};
  }
  // Getters for Bus Trips data
  public getTrips() {
    return this.#trips;
  }
  public getTripById(id: string) {
    return this.#trips[id] ?? {};
  }
  public getTripsByRouteId(id: string) {
    return Object.entries(this.#trips)
      .filter(([key, value]) => value.route_id === id)
      .map(([key, value]) => value);
  }

  // Getters for Route Shapes data
  public getShapeByShapeId(shapeId: string) {
    return this.#shapes[shapeId] ?? [];
  }
  public getShapeByRouteId(shapeId: string) {
    return this.#shapes[shapeId] ?? [];
  }

  // Getters for Stop Times data
  public getStopTimesByTripId(id: string) {
    return this.#stopTimes[id] ?? [];
  }
}

const GTFSLoader = new _GTFSLoader();
export default GTFSLoader;
