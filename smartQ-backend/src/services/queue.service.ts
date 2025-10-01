import { AppDataSource } from "../config/data-source";
import { Queue, QueueStatus } from "../entities/Queue.entity";
import { Repository } from "typeorm";

const queueRepo: Repository<Queue> = AppDataSource.getRepository(Queue);

export const createQueue = async (data: Partial<Queue>): Promise<Queue> => {
  return await queueRepo.save(queueRepo.create(data));
};

export const getQueueById = async (id: string): Promise<Queue | null> => {
  return await queueRepo.findOne({
    where: { queue_id: id },
    relations: ["service", "entries"],
  });
};

export const updateQueueStatus = async (id: string, status: QueueStatus): Promise<Queue | null> => {
  await queueRepo.update(id, { status });
  return getQueueById(id);
};

export const fetchAllQueues = async (): Promise<Queue[]> => {
  return await queueRepo.find({ relations: ["service"] });
};
