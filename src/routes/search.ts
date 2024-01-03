import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { searchController } from '../controllers/search';

const {Router} = express;

export const searchRouter = Router();

// search a note 
searchRouter.get("/", authMiddleware, searchController)