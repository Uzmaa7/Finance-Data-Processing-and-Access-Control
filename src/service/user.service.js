import User from "../model/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import { UserRoles } from "../utils/constants.js";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};

    } catch (error) {
        
     console.log("Something went wrong while generation ACCESS and REFRESH tokens", error)
        
    }
} 


const registerUserService = async (data) => {

    const {username, fullname, email, password, role} = data;

    if([username, fullname, email, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const userExists = await User.findOne({
        $or: [{username}, {email}]
    })

    if(userExists){
        throw new ApiError(409, "User with email or username already exist")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullname: fullname.toLowerCase(),
        email,
        password,
        role : role || UserRoles.VIEWER
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering user")
    }

    return createdUser;
}

const loginUserService = async(data) => {

    const {email, password} = data;

    if(!email){
        throw new ApiError(400, "email is required")
    }

    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid login credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   return {
        user: loggedInUser,
        accessToken,
        refreshToken
   }

    
}

export {registerUserService, loginUserService};