import type { Request, Response } from 'express';
import User from '../models/user.model.ts';
import bcrypt from 'bcryptjs';
import {generateToken} from "../lib/utils.ts";

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

export const signin=(req:Request, res:Response) => {
   try{
    
   }catch(error){

   }
}

export const logout=(req:Request, res:Response) => {
   try{
    
   }catch(error){

   }
}
