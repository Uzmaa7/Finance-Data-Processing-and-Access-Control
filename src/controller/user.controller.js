import { registerUserService, loginUserService } from "../service/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";


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

const loginUser = asyncHandler(async(req, res) => {

    const data = req.body;

    const { user, accessToken, refreshToken } = await loginUserService(data);

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user, 
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )

})

const logoutUser = asyncHandler(async(req, res) => {
        await User.findByIdAndUpdate(
            req.user._id,
            {
            $set : {refreshToken: undefined} 
            },
            {
                new: true
            }
        );

        const options = {
            httpOnly: true,
            secure: true,   
        }

        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken",options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        )
})

export {registerUser, loginUser, logoutUser};