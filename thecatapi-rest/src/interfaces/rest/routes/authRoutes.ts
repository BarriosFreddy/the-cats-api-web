import { Router, RequestHandler } from "express";
import UserController from "../controllers/userController";
import container from "../../../config/Container";
import AuthController from "../controllers/authController";

const userController: UserController = container.get<UserController>("UserController");
const authController: AuthController = container.get<AuthController>("AuthController");

const authRouter = Router();

authRouter.post("/register", userController.saveUser as RequestHandler);
authRouter.post("/login", authController.login as RequestHandler);
authRouter.post("/logout", authController.logout as RequestHandler);

export default authRouter