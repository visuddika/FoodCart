import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const userRouter = express.Router();

// Register route
userRouter.post("/register", registerUser);

// Login route
userRouter.post("/login", loginUser);

export default userRouter;