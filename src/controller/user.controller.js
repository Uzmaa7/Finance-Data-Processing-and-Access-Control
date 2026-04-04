import { registerUserService } from "../service/user.service.js";


const registerUser = asyncHandler(async(req, res) => {

    const data = req.body;

    const user = await registerUserService(data);

    return res.status(201).json(
        new ApiResponse(
            201,
            user,
            "User registered successfully"
        )
    )
})

export {registerUser};