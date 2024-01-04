import express from 'express';
import bodyParser from 'body-parser';
import { Request,Response } from 'express';
import { authRouter } from './routes/auth';
import { PrismaClient } from '@prisma/client'
import { notesRouter } from './routes/notes';
import { searchRouter } from './routes/search';
import { errorMiddleware } from './middlewares/error';

// initial configs
export const prisma = new PrismaClient()
const app = express();
const PORT = 3000;
const router = express.Router();

// use body-parser for incoming requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// basic health route
router.get('/', (req : Request, res : Response) => {
  res.json({message:'The Server is Up !!!'})
})

// actual logic routers
app.use(router);

router.use('/api/auth', authRouter);
router.use('/api/notes', notesRouter)
router.use('/api/search', searchRouter);

// handle error when invalid route is hit!!
router.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})