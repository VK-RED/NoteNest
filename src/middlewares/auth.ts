import { NextFunction, Request, Response } from "express";
import { INVALID_TOKEN, SECRET, TOKEN_MISSING } from "../constants";
import jwt from 'jsonwebtoken'

export const authMiddleware = async(req:Request, res:Response, next:NextFunction) => {

    try {
        
        const token = req.headers['token'] as string;
        if(!token) return res.json({message:TOKEN_MISSING});

        const data = jwt.verify(token, SECRET) as jwt.JwtPayload;
        const userId = data.userId as string;

        req.headers['userId'] = userId;
        next();

    } catch (error) {
        console.log(error);
        return res.json({message:INVALID_TOKEN})
    }
}