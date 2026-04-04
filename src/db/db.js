import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../utils/constants.js";

dotenv.config({
    path:"./.env"
})

const connectDB = async(req, res) => {
    try {

        const connectionInstance = await mongoose.connect
        (`${process.env.MONGODB_URL}/${DB_NAME}`)

        console.log(`\n MONGODB connected !! DB HOST: 
        ${connectionInstance.connection.host}`)

    } catch (error) {
        console.error("MONGODB connection FAILED !!", error);
        process.exit(1);
    }
}

export default connectDB;