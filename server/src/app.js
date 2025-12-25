import express from "express"
import userRouter from "../routes/user.route.js"
import userEntryRouter from "../routes/userEntry.route.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();


const app = express();
app.use(express.json());
app.use(cookieParser())

app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true
}));

app.use("/api/v1/user", userRouter)
app.use("/api/v1/userEntry", userEntryRouter)

export default app; 