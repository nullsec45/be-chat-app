import type { Request, Response } from 'express';
import User from '../models/user.model.ts';
import bcrypt from 'bcryptjs';
import { generateToken } from "../lib/utils.ts";
import cloudinary from "../lib/cloudinary.ts";

export const signup=async (req:Request,res:Response) => {
   const { name, email, password }=req.body;
   try{
      if(!name || !email || !password){
         return res.status(400).json({message:"All fields are required"});
      }

       if(password.length < 8){
         return res.status(400).json({message:"Password must be at least 8 characters,"});
      }

      const user=await User.findOne({ email });
   
      if (user) return res.status(400).json({message:"Email already exists"});

      const salt=await bcrypt.genSalt(10);
      const hashedPassword=await bcrypt.hash(password, salt);

      const newUser=new User({
         fullName:name,
         email,
         password:hashedPassword
      });

      if(newUser){
         generateToken(newUser._id.toString(), res);
         await newUser.save();

         res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilePict:newUser.profilePict,
         })
      }else{
         res.status(400).json({message:"Invalid user data"});
      }

   }catch(error:any){
      console.log("Error in signup controller", error.message);
      res.status(400).json({message:"Invalid user data"});

   }
}

export const signin=async (req:Request, res:Response) => {
   const { email, password } = req.body;

   try{
      const user=await User.findOne({email});

      if (!user) {
         return res.status(400).json({message:"Invalid credentials"});
      }

      const isPasswordCorrect=await bcrypt.compare(password, user.password);

      if(!isPasswordCorrect) {
         return res.status(400).json({message:"Invalid credentials"});
      }

      generateToken(user._id.toString(), res);

      res.status(200).json({
         _id:user._id,
         fullName:user.fullName,
         email:user.email,
         profilePict:user.profilePict
      })
   }catch(error:any){
      console.log("Error in login controller", error.message);
      res.status(500).json({message:"Internal Server Error"});
   }
}

export const logout=(req:Request, res:Response) => {
   try{
      res.cookie("jwt","", {maxAge:0});
      res.status(200).json({message:"Logged out successfully"});
   }catch(error:any){
      console.log("Error in logout controller", error.message);
      res.status(500).json( {message:"Internal Server Error"})
   }
}


export const updateProfile=async (req:Request, res:Response) => {
   try{
      const { profilePict="", name, email } = req.body;
      const userId=req.user._id;

      // if(!profilePict) {
      //    return res.status(400).json({message:"Profile Pict is Required"});
      // }

      let uploadResponse;
      if (profilePict){
         uploadResponse=await cloudinary.uploader.upload(profilePict);
      }

      const updatedUser=await User.findByIdAndUpdate(
         userId,
         { 
            profilePict:uploadResponse?.secure_url,
            fullName:name,
            email, 
         },
         { new:true }
      );

      res.status(200).json(updatedUser);
   }catch(error:any){
      console.log("Error in update profile controller", error.message);
      res.status(500).json( {message:"Internal Server Error"});
   }
}


export const myProfile=async(req:Request, res:Response) => {
   try{
       res.status(200).json(req.user);
   }catch(error:any){
      console.log("Error in my profile controller", error.message);
      res.status(500).json( {message:"Internal Server Error"});
   }
} 