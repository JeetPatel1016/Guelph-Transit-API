import { PB_VEHICLES } from "../lib/constants";
import { FeedMessage } from "../protobuf";

export const fetchBusPositions = async () => {
  const vehiclePositionsResponse = await fetch(PB_VEHICLES);
  if (!vehiclePositionsResponse.ok) {
    throw new Error("Could not connect to the app");
  }
  try {
    // Use .decode() directly and convert to object in one step
    const object = FeedMessage.toObject(
      FeedMessage.decode(
        new Uint8Array(await vehiclePositionsResponse.arrayBuffer())
      )
    );
    return object.entity.map((vehicle: any) => ({
      id: vehicle.id,
      routeId: vehicle.vehicle.trip.routeId,
      tripId: vehicle.vehicle.trip.tripId,
      speedInMS: vehicle.vehicle.position.speed,
      coordinates: [
        vehicle.vehicle.position.longitude,
        vehicle.vehicle.position.latitude,
      ],
    }));
  } catch (err) {
    console.log(err);
    if (err instanceof Error) throw new Error(err.message);
  }

  return [];
};
