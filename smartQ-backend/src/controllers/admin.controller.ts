import { Request, Response, NextFunction } from "express";
import { getAllUsers } from "../services/user.service";
import { instanceToPlain } from "class-transformer";

export const fetchAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users successfully fetched",
      users: instanceToPlain(users),
    });
  } catch (error) {
    next(error);
  }
};