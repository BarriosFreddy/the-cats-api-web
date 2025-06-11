import { User } from "../entities/User";

export interface AuthRepository {
    login(): User;
}