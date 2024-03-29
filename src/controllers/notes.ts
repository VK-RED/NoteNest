import { Request, Response } from 'express';
import {prisma} from "../index"
import { EditNotesProps, ShareNotesProps, createNotesProps } from '../schema';
import {z} from 'zod'

import { NEW_NOTE_ADDED, 
         NOTE_DELETED, 
         NOTE_EDITED, 
         NOTE_SHARED, 
         NOTE_SHARED_ALREADY, 
         NO_NOTE_FOUND, 
         SIGN_AGAIN, 
         UNFORSEEN_ERROR, 
         USER_NOT_FOUND } from '../constants';


// This file consists of controllers for notes router

// function to create a new note
export async function createNoteController(req:Request,res:Response){
    try {
        const {title,description} = createNotesProps.parse(req.body);
        const userId = req.headers['userId'] as string;

        const user = await prisma.user.findUnique({
            where:{
                id:userId,
            }
        });

        if(!user) return res.status(400).json({message:SIGN_AGAIN});

        //create a new note

        const newNote = await prisma.personalNotes.create({
            data:{
                title,
                description,
                userId
            }
        })

        return res.status(202).json({message:NEW_NOTE_ADDED});

    } catch (error) {

        if(error instanceof z.ZodError){
            console.log(error.errors);
            return res.status(404).json({error:error.errors});
        }

        return res.status(500).json({message:UNFORSEEN_ERROR});
    }
}

// edit an existing note 
export async function editNoteController(req:Request,res:Response){

    const noteId = req.params['id'];
    
    try {
        
        const parsedData = EditNotesProps.parse(req.body);

        const note = await prisma.personalNotes.findUnique({
            where:{
                id: noteId,
            }
        })

        if(!note) return res.status(400).json({message:NO_NOTE_FOUND});

        //update the new metadata

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

        return res.status(200).json({message:NOTE_EDITED})


    } catch (error) {
        if(error instanceof z.ZodError){
            console.log(error.errors);
            return res.status(402).json({error:error.errors});
        }

        return res.status(500).json({message:UNFORSEEN_ERROR});
    }
}

// delete an existing note
export async function deleteNoteController(req:Request,res:Response){
    const noteId = req.params['id'];
    
    try {
        
        const note = await prisma.personalNotes.findUnique({
            where:{
                id: noteId,
            }
        })

        if(!note) return res.status(404).json({message:NO_NOTE_FOUND});

        //delete the note

        await prisma.personalNotes.delete({
            where:{
                id: noteId,
            }
        })

        return res.status(200).json({message:NOTE_DELETED})


    } catch (error) {
        if(error instanceof z.ZodError){
            console.log(error.errors);
            return res.status(402).json({error:error.errors});
        }

        return res.status(500).json({message:UNFORSEEN_ERROR});
    }
}

// get the note by id
export async function getNoteController(req:Request,res:Response){
    const noteId = req.params['id'];
    
    try {
        
        const note = await prisma.personalNotes.findUnique({
            where:{
                id: noteId,
            },
        })

        if(!note) return res.status(400).json({message:NO_NOTE_FOUND});
        return res.status(200).json({note})

    } catch (error) {

        if(error instanceof z.ZodError){
            console.log(error.errors);
            return res.status(402).json({error:error.errors});
        }

        return res.status(500).json({message:UNFORSEEN_ERROR});
    }
}

// get all notes for a user
export async function getNotesController(req:Request,res:Response){
    const userId = req.headers['userId'] as string;
    
    try {
        
        const allNotes = await prisma.personalNotes.findMany({
            where:{
                userId,
            }
        })

        return res.status(200).json({allNotes})

    } catch (error) {

        console.log(error);
        return res.status(500).json({message:UNFORSEEN_ERROR});
    }
}

// share a note with another user

export async function shareNoteController(req:Request,res:Response){
    try {

        const noteId = req.params['id'];
        const userId = req.headers['userId'] as string;
        const {toUserId} = ShareNotesProps.parse(req.body);

        //check the note exists
        const existingNote = await prisma.personalNotes.findUnique({
            where:{
                id: noteId,
            }
        })

        if(!existingNote) return res.status(404).json({message:NO_NOTE_FOUND})

        // check the recepient user exists

        const recepient = await prisma.user.findUnique({
            where:{
                id: toUserId,
            }
        })

        if(!recepient) return res.status(404).json({message:USER_NOT_FOUND})

        // check if this note has already been shared with the recepient

        const existingSharedNote = await prisma.sharedNotes.findFirst({
            where:{
                title: existingNote.title,
                description: existingNote.description,
            }
        })
        
        if(existingSharedNote) return res.status(202).json({message:NOTE_SHARED_ALREADY})

        // share the note with the recepient if everything falls in place

        const sharedNotes = await prisma.sharedNotes.create({
            data:{
                description: existingNote.description,
                title: existingNote.title,
                fromUserId: userId,
                toUserId,
            }
        })

        return res.status(200).json({message:NOTE_SHARED});
        
    } catch (error) {

        if(error instanceof z.ZodError){
            console.log(error.errors);
            return res.status(402).json({error:error.errors});
        }

        console.log(error);
        return res.status(500).json({message:UNFORSEEN_ERROR});
    }
}