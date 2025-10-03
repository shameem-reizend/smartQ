import express from "express";
import { registerQueue, UpdateQueue, fetchAllQueuesHandler, fetchQueueDetails } from "../controllers/queue.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../entities/User.entity";

const queueRoutes = express.Router();
queueRoutes.use(authenticate);

queueRoutes.post("/", authorize(UserRole.SERVICE_PROVIDER), registerQueue);
queueRoutes.patch("/:id/status", authorize(UserRole.SERVICE_PROVIDER), UpdateQueue);
queueRoutes.get("/", fetchAllQueuesHandler);
queueRoutes.get("/:id", fetchQueueDetails);

export default queueRoutes;
