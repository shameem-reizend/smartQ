import { Request, Response, NextFunction } from "express";
import { joinQueue, getQueueEntries, updateEntryStatus, isUserJoined } from "../services/queueEntry.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ApiError } from "../utils/apiError";

export const joinQueueHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const exists = await isUserJoined(req.params.id, req.user.id)
    if(exists){
      throw new ApiError("You are already in this queue", 409);
    }

    const entry = await joinQueue(req.params.id, req.user.id);
    res.status(201).json({
      success: true,
      message: "Queue entry successfully created",
      entry,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchQueueEntries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const entries = await getQueueEntries(req.params.id);
    res.status(200).json({
      success: true,
      message: "Queue entries successfully fetched",
      entries,
    });
  } catch (error) {
    next(error);
  }
};

export const updateQueueEntryStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const entry = await updateEntryStatus(req.params.id, req.body.status);
    res.status(200).json({
      success: true,
      message: "Queue entry status successfully changed",
      entry,
    });
  } catch (error) {
    next(error);
  }
};
