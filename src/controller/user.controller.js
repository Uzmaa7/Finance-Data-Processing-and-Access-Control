import {asyncHandler} from "../utils/asyncHandler.js"
import { createUserService } from "../service/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {getUsersService, updateUserService, deleteUserService} from "../service/user.service.js";


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

const getUsers = asyncHandler(async(req, res) => {

    const response = await getUsersService(req.query);

    res.status(200).json(
        new ApiResponse(
            200,
            response,
            "Users fetched successfully"
        )
    )
})

const updateUser = asyncHandler(async(req, res) => {

    const {id} = req.params;
    const data = req.body;

    const user = await updateUserService(id, data);

    res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User updated successfully"
        )
    );
})


const deleteUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    await deleteUserService(id);
    res.status(200).json(
        new ApiResponse(
            200,
            {},
            "User deleted (Soft Delete)" 
        )
    );
})


export {createUser, getUsers, updateUser, deleteUser};