import mongoose from "mongoose";
import { AvailableUserRoles, AvailableUserStatus, UserRoles, UserStatus } from "../utils/constants";

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

const User = mongoose.model("User", userSchema);

export default User;