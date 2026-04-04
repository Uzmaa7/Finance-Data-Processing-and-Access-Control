import express from "express";
import { registerUser } from "../controller/user.controller.js";
import { registerUserValidator } from "../validator/user.validator";
import { validate } from "../middleware/validator.middleware.js";

const userRouter = express.Router();

userRouter.post("/", registerUserValidator(), validate, registerUser);

export default userRouter;