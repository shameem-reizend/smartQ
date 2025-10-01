import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User.entity";
import { Queue } from "./Queue.entity";

@Entity()
export class Service {
  @PrimaryGeneratedColumn("uuid")
  service_id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  location?: string;

  @ManyToOne(() => User, (user) => user.user_id, { eager: true })
  provider: User;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Queue, (queue) => queue.service)
  queues: Queue[];
}
