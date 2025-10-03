import express from "express";
import { joinQueueHandler, fetchQueueEntries, updateQueueEntryStatus } from "../controllers/queueEntry.controller";
import { authenticate } from "../middlewares/auth.middleware";

const queueEntryRoutes = express.Router();

queueEntryRoutes.post("/:id/join", authenticate, joinQueueHandler);
queueEntryRoutes.get("/:id/entries", fetchQueueEntries);
queueEntryRoutes.patch("/:id/status", updateQueueEntryStatus);

export default queueEntryRoutes;
