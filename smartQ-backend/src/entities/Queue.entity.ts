import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Service } from "./Service.entity";
import { QueueEntry } from "./QueueEntry.entity";

export enum QueueStatus {
  OPEN = "open",
  CLOSED = "closed",
}

@Entity()
export class Queue {
  @PrimaryGeneratedColumn("uuid")
  queue_id: string;

  @ManyToOne(() => Service, (service) => service.queues, { eager: true })
  service: Service;

  @Column({
    type: "enum",
    enum: QueueStatus,
    default: QueueStatus.OPEN,
  })
  status: QueueStatus;

  @Column({ nullable: true })
  max_capacity: number;

  @Column({ type: "int", default: 0 })
  current_size: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => QueueEntry, (entry) => entry.queue)
  entries: QueueEntry[];
}
