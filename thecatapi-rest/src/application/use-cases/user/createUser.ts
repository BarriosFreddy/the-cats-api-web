import { injectable, inject } from "inversify";
import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/UserRepository";


@injectable()
class CreateUser {
    private userRepository: UserRepository;

    constructor(@inject("UserRepository") userRepository: UserRepository) {
        this.userRepository = userRepository
    }
    async execute(userData: { name: string; email: string, password: string }) {
        const existing = await this.userRepository.findByEmail(userData.email);
        if (existing) throw new Error("User already exists");

        const user = new User(userData);
        return await this.userRepository.create(user);
    };
};

export default CreateUser