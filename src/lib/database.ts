import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

export const connectDB=async() => {
    try{
        const uri=process.env.DB_URI;

        if (!uri) {
            throw new Error("DB_URI is not defined in .env file");
        }

        const conn=await mongoose.connect(uri);
    }catch(error){

    }
}