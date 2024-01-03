import express from 'express';
import { SignupController, loginController } from '../controllers/auth';

const {Router} = express;
export const authRouter = Router();


// Signup Route
authRouter.post('/signup', SignupController)

// Login Route
authRouter.post('/login', loginController)