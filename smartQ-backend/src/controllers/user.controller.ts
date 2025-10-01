import { Request, Response, NextFunction } from "express";
import { createUser, findUserByEmail, getAllUsers } from "../services/user.service";
import { ApiError } from "../utils/apiError";
import { generateAccessToken } from "../utils/token";
import bcrypt from "bcrypt";
import { UserRole } from "../entities/User.entity";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const userRole = role || UserRole.USER;

    const existing = await findUserByEmail(email);
    if (existing) {
      throw new ApiError("email already in use", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      phone,
    });

    res.status(201).json({
      success: true,
      message: "User successfully created",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const userFound = await findUserByEmail(email);
    if (!userFound) {
      throw new ApiError("user not found", 404);
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      throw new ApiError("Invalid credentials", 401);
    }

    const payload = {
      id: userFound.user_id,
      email: userFound.email,
      role: userFound.role,
    };

    const accessToken = generateAccessToken(payload);

    res.status(200).json({
      success: true,
      message: "login successful",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users successfully fetched",
      users,
    });
  } catch (error) {
    next(error);
  }
};
