import { Request, Response, NextFunction } from "express";
import { createService, getServices } from "../services/service.service";

export const registerService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await createService(req.body);
    res.status(201).json({
      success: true,
      message: "Service successfully created",
      service,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchAllService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await getServices();
    res.status(200).json({
      success: true,
      message: "Services successfully fetched",
      services,
    });
  } catch (error) {
    next(error);
  }
};
