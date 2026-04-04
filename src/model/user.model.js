import mongoose from "mongoose";
import { AvailableUserRoles, AvailableUserStatus, UserRoles, UserStatus } from "../utils/constants";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,   
    },

    fullname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },

    password: {
        type: String,
        required: [true,"Password is required"],
        select: false,
    },

    refreshToken: {
        type: String,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    verificationToken: {
        type: String,
    },

    verificationTokenExpiry: {
        type: Date
    },

    role: {
        type: String,
        enum: AvailableUserRoles,
        default: UserRoles.VIEWER,
        index: true
    },

    status: {
        type: String,
        enum: AvailableUserStatus,
        default: UserStatus.ACTIVE,
    },

    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    }

},{timestamps:true})

// middleware(pre hook) to hash the password 
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id : this._id,
            role : this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
            
}

const User = mongoose.model("User", userSchema);

export default User;