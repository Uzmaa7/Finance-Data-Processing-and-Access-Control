import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/db/db.js";

dotenv.config({
    path: "./.env"
})

const port = process.env.PORT || 8000;

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
    })
})
.catch((error) => {
    console.error("Mongodb connection error", error);
})


