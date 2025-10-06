import express from "express";
import { registerService, fetchAllService, fetchServiceDetail } from "../controllers/service.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../entities/User.entity";

const serviceRoutes = express.Router();
serviceRoutes.use(authenticate);

serviceRoutes.post("/", authorize(UserRole.SERVICE_PROVIDER), registerService);
serviceRoutes.get("/", authorize(UserRole.SERVICE_PROVIDER, UserRole.ADMIN), fetchAllService);
serviceRoutes.get("/:id", authenticate, authorize(UserRole.SERVICE_PROVIDER), fetchServiceDetail);

export default serviceRoutes;
