import { User } from "../entities/User";

export interface UserRepository {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, user: User): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
