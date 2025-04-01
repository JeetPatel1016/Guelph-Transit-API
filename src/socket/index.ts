import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import { fetchBusPositions } from "./event-handlers";

const initializeSocket = (server: Server) => {
  const io = new SocketServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    // On requesting Bus Positions
    socket.on("bus-position", async () => {
      try {
        const data = await fetchBusPositions();
        socket.emit("bus-position", data);
      } catch (err: unknown) {
        if (err instanceof Error) socket.emit("error", err.message);
      }
    });
  });

  // Streams bus positions every 30 seconds
  setInterval(async () => {
    try {
      const data = await fetchBusPositions();
      io.emit("bus-position", data);
    } catch (err) {
      console.log(err);
    }
  }, 30000);
};

export default initializeSocket;
