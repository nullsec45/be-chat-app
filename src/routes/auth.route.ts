import express from "express";
import { signin, signup, logout } from "../controllers/auth.controller.ts";

const authRoutes=express.Router();

authRoutes.get("/signin",signin);

authRoutes.post("/signup", signup);

authRoutes.post("/logout", logout);



export default authRoutes;