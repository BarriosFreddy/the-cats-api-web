import { inject, injectable } from "inversify";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { User } from "../../../domain/entities/User";

@injectable()
class LoginUser {
    private userRepository: UserRepository;
    constructor(@inject("UserRepository") userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(userData: { email: string, password: string }): Promise<User | undefined> {
        const userFound = await this.userRepository.findByEmail(userData.email);
        if (!userFound) return;
        const { password, ...userFoundData } = userFound;
        if (userFound.password === userData.password) return userFoundData
    }
}

export default LoginUser