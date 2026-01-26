import jwt from "jsonwebtoken";
import User from "../models/user.model.ts";
import type { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";

dotenv.config();

interface DecodedToken {
    userId: string;
}

export const protectRoute=async (req:Request, res:Response, next:NextFunction) => {
    try{
        const token=req.cookies.jwt;

        if(!token){
            return res.status(401).json({message:"Unauthorized - No Token Provided"});
        }

        const SECRET=process.env.JWT_SECRET;

        if (!SECRET) {
            throw new Error("JWT_SECRET is not defined in .env file");
        }

        const decoded=jwt.verify(token, SECRET) as unknown as DecodedToken;;

        if(!decoded){
            return res.status(401).json({message:"Unauthorized - Invalid Token"});
        }

        if(!decoded || !decoded.userId){
            return res.status(401).json({message:"Unauthorized - Invalid Token"});
        }

        const user=await User.findById(decoded.userId).select("-password");

        if(!user) {
            return res.status(404).json({ message:"User not found" });
        }

        req.user=user;
        next();
    }catch(error:any){
        console.error("Error in protectRoute middleware:", error.message);
        
        // Menangani kasus token expired secara spesifik
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized - Token Expired" });
        }

        // Kirim respon error agar request tidak gantung
        res.status(500).json({ message: "Internal Server Error" });
    }
}