import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.BASE_URL,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.get("/", (req, res) => {
    res.send("finance tracker is Ready...!!! So are you???")
})

export default app;
