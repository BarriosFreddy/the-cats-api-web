import { Router, RequestHandler } from "express";
import UserController from "../controllers/userController";
import container from "../../../config/Container";

const userController: UserController = container.get<UserController>("UserController");
const userRouter = Router();

userRouter.post("/", userController.saveUser as RequestHandler);

export default userRouter