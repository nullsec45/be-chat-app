import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.ts";
import { connectDB } from "./lib/database.ts";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.ts";

dotenv.config();

const app=express();
const PORT=process.env.APP_PORT;


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
    console.log("server is running on port:" +PORT);
    connectDB();
});