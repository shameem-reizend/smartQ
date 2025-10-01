import { Request, Response, NextFunction } from "express";
import { createQueue, updateQueueStatus, fetchAllQueues, getQueueById } from "../services/queue.service";

export const registerQueue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queue = await createQueue(req.body);
    res.status(201).json({
      success: true,
      message: "Queue successfully created",
      queue,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateQueue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queue = await updateQueueStatus(req.params.id, req.body.status);
    res.status(200).json({
      success: true,
      message: "Queue successfully updated",
      queue,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchAllQueuesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queues = await fetchAllQueues();
    res.status(200).json({
      success: true,
      message: "Queues successfully fetched",
      queues,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchQueueDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queue = await getQueueById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Queue successfully fetched",
      queue,
    });
  } catch (error) {
    next(error);
  }
};
