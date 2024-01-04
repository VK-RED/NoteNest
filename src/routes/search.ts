import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { searchController } from '../controllers/search';
import { limiterMiddleware } from '../middlewares/rateLimiter';

const {Router} = express;

export const searchRouter = Router();

// authentication and rate limiter middlewares
searchRouter.use(authMiddleware);
searchRouter.use(limiterMiddleware);

// search a note 
searchRouter.get("/", searchController)