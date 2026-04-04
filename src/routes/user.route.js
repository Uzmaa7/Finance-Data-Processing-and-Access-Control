import express from "express";
import { loginUser, logoutUser, registerUser } from "../controller/user.controller.js";
import { loginValidation, registerUserValidation } from "../validator/user.validator";
import { validate } from "../middleware/validator.middleware.js";
import {verifyJWT} from "../middleware/auth.middleware.js"


const userRouter = express.Router();

userRouter.post("/", registerUserValidation(), validate, registerUser);

userRouter.post("/login", loginValidation(), validate, loginUser);

//secure routes
userRouter.post("/logout", verifyJWT, logoutUser);

export default userRouter;