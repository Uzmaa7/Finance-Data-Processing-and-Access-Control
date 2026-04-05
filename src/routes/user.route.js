import express from "express-validator";
import { authorizeRoles } from "../middleware/role.middleware.js";
import {UserRoles} from "../utils/constants.js"
import {verifyJWT} from "../middleware/auth.middleware.js"


const userRouter = express.Router();

//==============================//
//   Only ADMIN can manage user
//===============================// 

userRouter.use(verifyJWT);
userRouter.use(authorizeRoles(UserRoles.ADMIN));


userRouter.post("/", createUser);

userRouter.get("/", getUsers);

userRouter.patch("/:id", updateUser);

userRouter.delete("/:id", deleteUser);

export default userRouter;