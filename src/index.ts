import express, { Request, Response } from "express";
import cors from "cors";
import routesRouter from "./routes/routes";
import { createServer } from "http";
import initializeSocket from "./socket";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello" });
});

app.use("/routes", routesRouter);

const server = createServer(app);

initializeSocket(server);

server.listen(port, () => {
  console.log("=============== SERVER STARTED ===============");
});
