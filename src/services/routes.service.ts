import GTFSLoader from "../gtfs/GTFSLoader";

// Get all information of all routes
export function getRoutes() {
  return GTFSLoader.getRoutes();
}

// Get Details of a route including its bus stops
export function getRouteById(routeId: string) {
  const route = GTFSLoader.getRouteById(routeId);
  if (!route) return {};
  const tripIds = Object.values(GTFSLoader.getTrips()).filter(
    (trip) => trip.route_id === routeId
  );

  const stopIds = new Set<string>();
  tripIds.forEach((trip) => {
    const tripStopTimes = GTFSLoader.getStopTimesByTripId(trip.trip_id);
    if (tripStopTimes)
      tripStopTimes.forEach((stopTime) => stopIds.add(stopTime.stop_id));
  });

  const stops = Array.from(stopIds).map((stopId) =>
    GTFSLoader.getStopById(stopId)
  );
  return {
    ...route,
    route_stops: stops,
  };
}

// Get Shape of a route trip for Map Display
export function getRouteShape(routeId: string) {
  const data: ReturnType<typeof GTFSLoader.getShapeByShapeId>[] = [];
  const shapeIds = new Set<string>();
  GTFSLoader.getTripsByRouteId(routeId).forEach((trip) =>
    shapeIds.add(trip.shape_id)
  );
  shapeIds.forEach((shapeId) => {
    data.push(GTFSLoader.getShapeByShapeId(shapeId));
  });
  return data;
}
