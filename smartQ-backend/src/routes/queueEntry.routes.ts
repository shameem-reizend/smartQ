import express from "express";
import { joinQueueHandler, fetchQueueEntries, updateQueueEntryStatus } from "../controllers/queueEntry.controller";

const queueEntryRoutes = express.Router();

queueEntryRoutes.post("/:id/join", joinQueueHandler);
queueEntryRoutes.get("/:id/entries", fetchQueueEntries);
queueEntryRoutes.patch("/:id/status", updateQueueEntryStatus);

export default queueEntryRoutes;
