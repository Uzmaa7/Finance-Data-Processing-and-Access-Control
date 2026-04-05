import express from "express";
import { authorizeRoles } from "../middleware/role.middleware.js";
import {UserRoles} from "../utils/constants.js"
import {verifyJWT} from "../middleware/auth.middleware.js"
import { validate } from "../middleware/validator.middleware.js";
import { registerUserValidation } from "../validator/auth.validator.js";
import { createUser, getUsers, updateUser, deleteUser } from "../controller/user.controller.js";
import { updateUserService } from "../service/user.service.js";
import { updateUserValidator } from "../validator/user.validator.js";

const userRouter = express.Router();

//==============================//
//   Only ADMIN can manage user
//===============================// 

userRouter.use(verifyJWT);
userRouter.use(authorizeRoles(UserRoles.ADMIN));


userRouter.post("/", registerUserValidation(), validate, createUser);

userRouter.get("/", getUsers);

userRouter.patch("/:id", updateUserValidator(), validate, updateUser);

userRouter.delete("/:id", deleteUser);

export default userRouter;