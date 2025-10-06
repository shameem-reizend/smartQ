import { Request, Response, NextFunction } from "express";
import { createService, getServiceById, getServices } from "../services/service.service";
import { ApiError } from "../utils/apiError";

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

export const fetchServiceDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await getServiceById(req.params.id);
    if(!service){
      throw new ApiError('Service not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Service fetched successfully',
      service
    })
  } catch (error) {
    next(error)
  }
}
