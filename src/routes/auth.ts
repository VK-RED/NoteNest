import express, { Request, Response } from 'express';
const {Router} = express;

export const authRouter = Router();


// Signup Route

authRouter.get('/signup', (req:Request, res:Response)=>{
    res.json({msg:"You are authenticated"})
})

// Login Route

authRouter.get('/login', (req:Request, res:Response)=>{
    res.json({msg:"You are authenticated"})
})