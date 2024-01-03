import express, { Request, Response } from 'express';
import {prisma} from "../index"
import {z} from 'zod';
import { EditNotesProps, createNotesProps } from '../types';
import { authMiddleware } from '../middlewares/auth';
import { NEW_NOTE_ADDED, NOTE_EDITED, NO_NOTE_FOUND, SIGN_AGAIN, UNFORSEEN_ERROR } from '../constants';

const {Router} = express;

export const notesRouter = Router();

//add a new note

notesRouter.post("/", authMiddleware, async (req:Request,res:Response) => {

    try {
        const {title,description} = createNotesProps.parse(req.body);
        const userId = req.headers['userId'] as string;

        const user = await prisma.user.findUnique({
            where:{
                id:userId,
            }
        });

        if(!user) return res.json({message:SIGN_AGAIN});

        const newNote = await prisma.personalNotes.create({
            data:{
                title,
                description,
                userId
            }
        })

        return res.json({message:NEW_NOTE_ADDED});

    } catch (error) {

        if(error instanceof z.ZodError){
            console.log(error.errors);
            return res.json({error:error.errors});
        }

        return res.json({message:UNFORSEEN_ERROR});
    }
})

//edit a note if it exists

notesRouter.put("/:id", authMiddleware, async (req : Request,res : Response) => {
    const noteId = req.params['id'];
    
    try {
        
        const parsedData = EditNotesProps.parse(req.body);

        const note = await prisma.personalNotes.findUnique({
            where:{
                id: noteId,
            }
        })

        if(!note) return res.json({message:NO_NOTE_FOUND});

        if(parsedData.title){
            await prisma.personalNotes.update({
                where:{
                    id: noteId
                },
                data:{
                    title:parsedData.title
                }
            })
        }
        if(parsedData.description){
            await prisma.personalNotes.update({
                where:{
                    id: noteId
                },
                data:{
                    description:parsedData.description
                }
            })
        }

        return res.json({message:NOTE_EDITED})


    } catch (error) {
        if(error instanceof z.ZodError){
            console.log(error.errors);
            return res.json({error:error.errors});
        }

        return res.json({message:UNFORSEEN_ERROR});
    }
})