import {asyncHandler} from "../utils/asyncHandler.js"
import { createUserService } from "../service/auth.service.js";

const createUser = asyncHandler(async(req, res) => {

    const data = req.body;

    const user = await createUserService(data);

    return res.status(201).json(
        new ApiResponse(
            201,
            user,
            "User created by ADMIN successfully"
        )
    )
})

export {createUser};