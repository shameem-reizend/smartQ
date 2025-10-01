import { AppDataSource } from "../config/data-source";
import { Service } from "../entities/Service.entity";
import { Repository } from "typeorm";

const serviceRepo: Repository<Service> = AppDataSource.getRepository(Service);

export const createService = async (data: Partial<Service>): Promise<Service> => {
  return await serviceRepo.save(serviceRepo.create(data));
};

export const getServices = async (): Promise<Service[]> => {
  return await serviceRepo.find({ relations: ["provider"] });
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  return await serviceRepo.findOne({
    where: { service_id: id },
    relations: ["provider", "queues"],
  });
};
