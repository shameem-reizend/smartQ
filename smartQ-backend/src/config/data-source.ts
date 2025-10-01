import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Service } from "../entities/Service.entity";
import { User } from "../entities/User.entity";
import { Queue } from "../entities/Queue.entity";
import { QueueEntry } from "../entities/QueueEntry.entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Service, Queue, QueueEntry],
});
