import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { CreateUser } from "../../../application/use-cases/user";

@injectable()
class UserController {
  private createUserUseCase: CreateUser;

  constructor(
    @inject("CreateUser") createUserUseCase: CreateUser
  ) {
    this.createUserUseCase = createUserUseCase;
  
    this.saveUser = this.saveUser.bind(this)
  }
  
  async saveUser(req: Request, res: Response) {
    try {
      const user = await this.createUserUseCase.execute(req.body);
      res.status(201).json(user);
    } catch (err: any) {
      if (err.message === "User already exists") {
        return res.status(409).json({ message: err.message });
      }
      res.status(400).json({ message: err.message });
    }
  }
};

export default UserController