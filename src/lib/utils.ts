import jwt from "jsonwebtoken";
import type { Request, Response } from 'express';


export const generateToken=(userId:string, res:Response) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is missing in environment variables");
    }

    const token=jwt.sign({userId}, secret, {
        expiresIn:"7d"
    });

    res.cookie("jwt", token, {
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.APP_ENV !== "development"
    });

    return token;
}