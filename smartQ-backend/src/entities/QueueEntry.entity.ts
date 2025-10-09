import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Queue } from "./Queue.entity";
import { User } from "./User.entity";

export enum queueEntryStatus {
  WAITING = "waiting",
  SERVED = "served",
  CANCELLED = "cancelled",
}

@Entity()
export class QueueEntry {
  @PrimaryGeneratedColumn("uuid")
  entry_id: string;

  @ManyToOne(() => Queue, (queue) => queue.entries)
  queue: Queue;

  @ManyToOne(() => User, (user) => user.queueEntries, { eager: true })
  user: User;

  @Column()
  queue_number: number;

  @Column({
    type: "enum",
    enum: queueEntryStatus,
    default: queueEntryStatus.WAITING,
  })
  status: queueEntryStatus;

  @CreateDateColumn()
  joined_at: Date;

  @Column({ type: "timestamp", nullable: true })
  served_at: Date;
}
