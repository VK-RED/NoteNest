import express, { Request, Response } from 'express';
import { AuthInputProps } from '../types';

import {prisma} from "../index"
import { ACCOUNT_CREATION_SUCCESS, USER_EXISTS } from '../constants';
import {ZodError, z} from 'zod';
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

            return res.json({message:ACCOUNT_CREATION_SUCCESS, userId: newUser.id});
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
authRouter.post('/login', (req:Request, res:Response)=>{
    
})