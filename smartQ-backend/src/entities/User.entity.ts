import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { QueueEntry } from "./QueueEntry.entity";

export enum UserRole {
  USER = "user",
  SERVICE_PROVIDER = "service provider",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  user_id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => QueueEntry, (entry) => entry.user)
  queueEntries: QueueEntry[];
}
