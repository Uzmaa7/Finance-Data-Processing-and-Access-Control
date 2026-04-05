import User from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const getUsersService = async (query) => {

    let {role, status, page = 1, limit = 10} = query;

    page = Math.max(1, parseInt(page));

    limit = Math.min(10 , Math.max(1, parseInt(limit)));

    const skip = ( page - 1 ) * limit;

    const filter = {isDeleted: false};

    if(role) filter.role = role;
    if(status) filter.status = status;

    const [users, total] = await Promise.all([
        User.find(filter)
            .select("-password -refreshToken")
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean(),

        User.countDocuments(filter)
    ])

    return {
        users,
        total,
        totalPages: Math.ceil(total/limit),
        currentPage: page,
    }
}

//Update User (Role/Status/Details)
const updateUserService = async(userId, updateData) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!user) throw new ApiError(404, "User not found");
    return user;
}

//Soft Delete User
const deleteUserService = async (userId) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { 
            $set: { 
                isDeleted: true, 
                status: 'INACTIVE',
                refreshToken: undefined
            }   
        },
        { new: true }
    );
    if (!user) throw new ApiError(404, "User not found or already deactivated");
    return true;
}

export {getUsersService, updateUserService, deleteUserService};