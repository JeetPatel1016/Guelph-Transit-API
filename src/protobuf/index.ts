import protobuf from "protobufjs";

const root = protobuf.loadSync("./src/gtfs/gtfs-realtime.proto");
export const FeedMessage = root.lookupType("transit_realtime.FeedMessage");
