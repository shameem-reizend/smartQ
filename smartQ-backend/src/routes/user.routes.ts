import express from "express";
import { registerUser, login } from "../controllers/user.controller";

const userRoutes = express.Router();

userRoutes.post("/", registerUser);
userRoutes.post("/login", login);

export default userRoutes;
