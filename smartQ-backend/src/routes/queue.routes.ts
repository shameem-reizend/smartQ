import express from "express";
import { registerQueue, UpdateQueue, fetchAllQueuesHandler, fetchQueueDetails } from "../controllers/queue.controller";

const queueRoutes = express.Router();

queueRoutes.post("/", registerQueue);
queueRoutes.patch("/:id/status", UpdateQueue);
queueRoutes.get("/", fetchAllQueuesHandler);
queueRoutes.get("/:id", fetchQueueDetails);

export default queueRoutes;
