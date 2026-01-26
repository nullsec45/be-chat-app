import express from "express";
import { signin, signup, logout, updateProfile, myProfile } from "../controllers/auth.controller.ts";
import { protectRoute } from "../middleware/auth.middleware.ts";

const authRoutes=express.Router();

authRoutes.post("/signin",signin);

authRoutes.post("/signup", signup);

authRoutes.post("/logout", logout);

authRoutes.put("/update-profile", protectRoute, updateProfile);

authRoutes.get("/my-profile", protectRoute, myProfile);


export default authRoutes;