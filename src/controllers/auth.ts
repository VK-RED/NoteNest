import { Request, Response } from 'express';
import { AuthInputProps } from '../schema';
import {prisma} from "../index"
import jwt from 'jsonwebtoken'
import { ACCOUNT_CREATION_SUCCESS, PASSWORD_MISMATCH, SALT_ROUNDS, SECRET, USER_EXISTS, USER_NOT_FOUND } from '../constants';
import {z} from 'zod'
import bcrypt from 'bcrypt'

// function to signup a user

export async function SignupController(req:Request, res:Response){
    try {
        const parsedData = AuthInputProps.parse(req.body);

        const existingUser = await prisma.user.findUnique({
            where:{
                email:parsedData.email,
            }
        })

        const hashedPassword = bcrypt.hashSync(parsedData.password, SALT_ROUNDS);

        // only create a new user if not exists already
        if(!existingUser){
            const newUser = await prisma.user.create({
                data:{
                    email:parsedData.email,
                    password: hashedPassword
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
}

export async function loginController(req:Request, res:Response){

    try {
        const parsedData = AuthInputProps.parse(req.body);

        const existingUser = await prisma.user.findUnique({
            where:{
                email:parsedData.email,
            }
        })

        // allow login only if the user exists and passwords match 

        if(!existingUser){
            return res.json({message:USER_NOT_FOUND})
        }
        else if(!bcrypt.compareSync(parsedData.password, existingUser.password)){
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
}