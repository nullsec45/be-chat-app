import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.ts";
import { connectDB } from "./lib/database.ts";

dotenv.config();

const app=express();
const PORT=process.env.APP_PORT;


app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log("server is running on port:" +PORT);
    connectDB();
});