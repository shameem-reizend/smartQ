import express from "express";
import { joinQueueHandler, fetchQueueEntries, updateQueueEntryStatus } from "../controllers/queueEntry.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../entities/User.entity";

const queueEntryRoutes = express.Router();

queueEntryRoutes.post("/:id/join", authenticate, authorize(UserRole.USER), joinQueueHandler);
queueEntryRoutes.get("/:id/entries", fetchQueueEntries);
queueEntryRoutes.patch("/:id/status", updateQueueEntryStatus);

export default queueEntryRoutes;
