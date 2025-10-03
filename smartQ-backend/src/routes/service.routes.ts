import express from "express";
import { registerService, fetchAllService } from "../controllers/service.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../entities/User.entity";

const serviceRoutes = express.Router();
serviceRoutes.use(authenticate);

serviceRoutes.post("/", authorize(UserRole.SERVICE_PROVIDER), registerService);
serviceRoutes.get("/", authorize(UserRole.SERVICE_PROVIDER), fetchAllService);

export default serviceRoutes;
