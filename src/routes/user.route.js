import express from "express";
import { authorizeRoles } from "../middleware/role.middleware.js";
import {UserRoles} from "../utils/constants.js"
import {verifyJWT} from "../middleware/auth.middleware.js"
import { validate } from "../middleware/validator.middleware.js";
import { registerUserValidation } from "../validator/auth.validator.js";
import { createUser, getUsers } from "../controller/user.controller.js";

const userRouter = express.Router();

//==============================//
//   Only ADMIN can manage user
//===============================// 

userRouter.use(verifyJWT);
userRouter.use(authorizeRoles(UserRoles.ADMIN));


userRouter.post("/", registerUserValidation(), validate, createUser);

userRouter.get("/", getUsers);

userRouter.patch("/:id", updateUser);

userRouter.delete("/:id", deleteUser);

export default userRouter;