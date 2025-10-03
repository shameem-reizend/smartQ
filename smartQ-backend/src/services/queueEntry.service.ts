import { AppDataSource } from "../config/data-source";
import { Queue } from "../entities/Queue.entity";
import { QueueEntry, queueEntryStatus } from "../entities/QueueEntry.entity";
import { ApiError } from "../utils/apiError";
import { Repository } from "typeorm";

const entryRepo: Repository<QueueEntry> = AppDataSource.getRepository(QueueEntry);
const queueRepo: Repository<Queue> = AppDataSource.getRepository(Queue);

export const joinQueue = async (queue_id: string, user_id: string): Promise<QueueEntry> => {
  const queue = await queueRepo.findOne({ where: { queue_id } });
  if (!queue) {
    throw new ApiError("Queue not found", 404);
  }

  if (queue.max_capacity && queue.current_size! >= queue.max_capacity) {
    throw new ApiError("Queue is full", 400);
  }

  const lastEntry = await entryRepo.findOne({
    where: { queue: { queue_id } },
    order: { queue_number: "DESC" },
  });

  const nextNumber = lastEntry ? lastEntry.queue_number + 1 : 1;

  const entry = entryRepo.create({
    queue: { queue_id } as any,
    user: { user_id } as any,
    queue_number: nextNumber,
    status: queueEntryStatus.WAITING,
  });

  await entryRepo.save(entry);

  queue.current_size = (queue.current_size || 0) + 1;
  await queueRepo.save(queue);

  return entry;
};

export const getQueueEntries = async (queue_id: string): Promise<QueueEntry[]> => {
  return await entryRepo.find({
    where: { queue: { queue_id } },
    relations: ["user"],
    order: { queue_number: "ASC" },
  });
};

export const updateEntryStatus = async (entry_id: string, status: queueEntryStatus): Promise<QueueEntry | null> => {
  await entryRepo.update(entry_id, { status });
  return entryRepo.findOne({ where: { entry_id }, relations: ["user"] });
};

export const isUserJoined = async (queue_id: string, user_id) => {

  return await entryRepo.findOne({
    where: {
      queue: {queue_id: queue_id},
      user: {user_id: user_id},
      status: queueEntryStatus.WAITING
    }
  });
}
