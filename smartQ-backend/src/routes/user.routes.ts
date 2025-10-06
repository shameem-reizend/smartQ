import express from "express";
import { registerUser, login, fetchCurrentUser } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

const userRoutes = express.Router();

userRoutes.post("/", registerUser);
userRoutes.post("/login", login);
userRoutes.get("/current-user", authenticate, fetchCurrentUser);

export default userRoutes;
