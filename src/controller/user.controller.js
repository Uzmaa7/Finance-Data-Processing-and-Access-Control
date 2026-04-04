import { registerUserService, loginUserService } from "../service/user.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

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

const refreshAccessToken  = asyncHandler(async ( req, res) => {

    // console.log("refreshAccessToken endpoint hit");

    const incomingRefreshToken = req.cookies.refreshToken

    if (!incomingRefreshToken || typeof incomingRefreshToken !== 'string') {
        throw new ApiError(401,  "Refresh token is missing or malformed" )
    }

    if(!incomingRefreshToken){
        return res.status(401).json({
            message: "unauthorized request"
        })
    }

    try {
       
        const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
      
      
        if(!decodedRefreshToken){
            throw new ApiError(401,  "Invalid refresh token" )
        }
      

        //decodedRefreshToken has _id in its payload
        const user = await User.findOne(
            {
                _id : decodedRefreshToken._id,
                refreshToken : incomingRefreshToken
            }
        );
      
        if(!user){
            throw new ApiError(401,  "Invalid refresh token" )  
        }
       
        if(incomingRefreshToken !== user?.refreshToken){           
            user.refreshToken = undefined;
            throw new ApiError(401,  "refresh token is expired or used" )  
        }

        //generate new tokens

        const options = {
            httpOnly: true,
            secure: true,
        }
       
       const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);


        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken, user},
                "Access token refreshed",
            )
        )
        
    } catch (error) {
        console.log("refreshAccessToken error", error);
       throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

export {registerUser, loginUser, logoutUser, refreshAccessToken};