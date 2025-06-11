import { Express } from "express"
import userRouter from "./userRoutes"
import authRouter from "./authRoutes"
import { breedRouter } from "./breedRoutes"
import { authMiddleware } from "../middlewares/authMiddleware"

const routes = (app: Express) => {
    // Public routes (no authentication required)
    app.use("/auth", authRouter)
    app.use("/users", userRouter)
    
    // Protected routes (authentication required)
    app.use("/breeds", authMiddleware, breedRouter)
}

export default routes