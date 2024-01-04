import { NextFunction, Request, Response } from "express";
import { NO_ROUTE_FOUND } from "../constants";

export const errorMiddleware = async(req:Request, res:Response, next:NextFunction) => {
    res.status(404).json({message:NO_ROUTE_FOUND})
}