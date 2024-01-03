import express, { Request, Response } from 'express';
import { AuthInputProps } from '../schema';
import jwt from 'jsonwebtoken';
import {prisma} from "../index"
import {z} from 'zod';
import { ACCOUNT_CREATION_SUCCESS, 
         PASSWORD_MISMATCH, 
         SECRET, 
         USER_EXISTS, 
         USER_NOT_FOUND,
        } from '../constants';

const {Router} = express;

export const authRouter = Router();


// Signup Route

authRouter.post('/signup', async(req:Request, res:Response)=>{

    try {
        const parsedData = AuthInputProps.parse(req.body);

        const existingUser = await prisma.user.findUnique({
            where:{
                email:parsedData.email,
            }
        })

        if(!existingUser){
            const newUser = await prisma.user.create({
                data:{
                    email:parsedData.email,
                    password: parsedData.password,
                }
            })

            const token = jwt.sign({userId:newUser.id},SECRET,{expiresIn:"1h"})
            return res.json({message:ACCOUNT_CREATION_SUCCESS, userId: newUser.id,token});
        }
        else{
            throw new Error(USER_EXISTS);
        }
        
    } catch (error) {

        if(error instanceof z.ZodError){
            console.log(error.issues);
            return res.json({issues: error.issues});
        }
        else{
            console.log(error);
            return res.json({message:USER_EXISTS});
        }
    }
    
})

// Login Route
authRouter.post('/login', async (req:Request, res:Response)=>{

    try {
        const parsedData = AuthInputProps.parse(req.body);

        const existingUser = await prisma.user.findUnique({
            where:{
                email:parsedData.email,
            }
        })

        if(!existingUser){
            return res.json({message:USER_NOT_FOUND})
        }
        else if(existingUser.password !== parsedData.password){
            return res.json({message:PASSWORD_MISMATCH})
        }
        else{
            const token = jwt.sign({userId:existingUser.id},SECRET,{expiresIn:'1h'});
            return res.json({userId: existingUser.id,token});
        }
        
    } catch (error) {

        if(error instanceof z.ZodError){
            console.log(error.issues);
            return res.json({issues: error.issues});
        }
        else{
            console.log(error);
            return res.json({message:"something went wrong"})
        }
    }
    
})