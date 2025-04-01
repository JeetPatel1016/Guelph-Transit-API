// A router to handle all API Endpoints related to bus routes.
import { Request, Response, Router } from "express";
import {
  getRouteById,
  getRoutes,
  getRouteShape,
} from "../services/routes.service";
const routesRouter = Router();

routesRouter.get("/", async (req: Request, res: Response) => {
  const data = getRoutes();
  res.status(200).json(data);
});

routesRouter.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const data = getRouteById(id);
  res.status(200).json(data);
});

routesRouter.get("/:id/shape", (req: Request, res: Response) => {
  const { id } = req.params;
  const data = getRouteShape(id);
  res.status(200).json(data);
});

export default routesRouter;
