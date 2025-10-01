import express from "express";
import { registerUser, fetchAllUsers, login } from "../controllers/user.controller";

const userRoutes = express.Router();

userRoutes.post("/", registerUser);
userRoutes.get("/", fetchAllUsers);
userRoutes.post("/login", login);

export default userRoutes;
