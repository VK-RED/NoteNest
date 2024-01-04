import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { createNoteController, 
         deleteNoteController, 
         editNoteController, 
         getNoteController, 
         getNotesController, 
         shareNoteController } from '../controllers/notes';
import { limiterMiddleware } from '../middlewares/rateLimiter';

const {Router} = express;

export const notesRouter = Router();


// Add authentication and rate limit middlewares
notesRouter.use(authMiddleware);
notesRouter.use(limiterMiddleware);

//add a new note
notesRouter.post("/", createNoteController);

//edit a note if it exists
notesRouter.put("/:id", editNoteController);

// delete a note
notesRouter.delete("/:id", deleteNoteController);

// get a single note
notesRouter.get("/:id", getNoteController);

// get all notes
notesRouter.get("/", getNotesController)

// share a note with another user
notesRouter.post("/:id/share", shareNoteController)

