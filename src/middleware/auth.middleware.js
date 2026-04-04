import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

dotenv.config({
    path: "./.env"
})


export const verifyJWT = async (req, res, next) => {
    // console.log("Cookies received:", req.cookies);
    try {
        const token = req.cookies?.accessToken || req.header
        ("Authorization")?.replace("Bearer ", "")
        
        // console.log("Extracted token:", token);
        if(!token){
            return res.status(401).json({
                message: "Unauthorized request"
            })
        }
    
        //token is genuine or not?
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log("Decoded token:", decodedToken);

    
    
            const user = await User.findById(decodedToken).select("-password -refreshToken");
            // console.log("User found from token:", user);
            if(!user){
                return res.status(401).json({
                    message: "Invalid Access Token"
                })
            }
    
            req.user = user;//req.user me user object hai pura
            next();
            
    } catch (error) {
        console.log("verifyJWT error", error);
        return res.status(401).json({
            message: "Invalid access token"
        })
    }

    
}