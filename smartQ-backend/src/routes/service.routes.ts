import express from "express";
import { registerService, fetchAllService } from "../controllers/service.controller";

const serviceRoutes = express.Router();

serviceRoutes.post("/", registerService);
serviceRoutes.get("/", fetchAllService);

export default serviceRoutes;
