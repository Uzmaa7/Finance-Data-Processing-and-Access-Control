import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import financialRecordsRouter from "./routes/financialRecords.route.js";

const app = express();

app.use(cors({
    origin: process.env.BASE_URL,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());



app.get("/", (req, res) => {
    res.send("finance tracker is Ready...!!! So are you???")
})

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/financialRecords", financialRecordsRouter);

export default app;
