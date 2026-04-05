import express from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controller/auth.controller.js";
import { loginValidation, registerUserValidation } from "../validator/auth.validator.js";
import { validate } from "../middleware/validator.middleware.js";
import {verifyJWT} from "../middleware/auth.middleware.js"


const authRouter = express.Router();

authRouter.post("/", registerUserValidation(), validate, registerUser);

authRouter.post("/login", loginValidation(), validate, loginUser);

//secure routes
authRouter.post("/logout", verifyJWT, logoutUser);

authRouter.post("/refresh-token", refreshAccessToken);

export default authRouter;