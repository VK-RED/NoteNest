import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { createNoteController, 
         deleteNoteController, 
         editNoteController, 
         getNoteController, 
         getNotesController, 
         shareNoteController } from '../controllers/notes';

const {Router} = express;

export const notesRouter = Router();

//add a new note
notesRouter.post("/", authMiddleware, createNoteController);

//edit a note if it exists
notesRouter.put("/:id", authMiddleware, editNoteController);

// delete a note
notesRouter.delete("/:id", authMiddleware, deleteNoteController);

// get a single note
notesRouter.get("/:id", authMiddleware, getNoteController);

// get all notes
notesRouter.get("/", authMiddleware, getNotesController)

// share a note with another user
notesRouter.post("/:id/share", authMiddleware, shareNoteController)

