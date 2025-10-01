import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User.entity";
import { Repository } from "typeorm";

const userRepo: Repository<User> = AppDataSource.getRepository(User);

export const createUser = async (data: Partial<User>): Promise<User> => {
  return await userRepo.save(userRepo.create(data));
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await userRepo.findOne({ where: { email } });
};

export const getAllUsers = async (): Promise<User[]> => {
  return await userRepo.find();
};
