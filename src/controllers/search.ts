import { Request, Response } from "express";
import {prisma} from "../index"
import { NO_RESULTS, UNFORSEEN_ERROR } from "../constants";

// This file consists of controller for search router

// function to search a note 
export async function searchController(req:Request, res:Response){
    try {
        const query = req.query.q as string;
        const userId = req.headers['userId'] as string;

        // get all the personal as well as shared notes

        const allPersonalNotes = await prisma.personalNotes.findMany({
            where:{
                userId,
            },
            select:{
                title:true,
                description:true
            }
        })

        const allSharedNotes = await prisma.sharedNotes.findMany({
            where:{
                toUserId: userId
            },
            select:{
                title:true,
                description:true
            }
        })

        // search through the personal notes
        const filteredPersonalNotes = allPersonalNotes.filter((n)=>{
            const title = n.title.toLowerCase();
            const description = n.description.toLowerCase();
            const q = query.toLowerCase();

            if(title.includes(q) || description.includes(q)) return n;
        })

        // search through the shared notes
        const filteredSharedNotes = allSharedNotes.filter((n)=>{
            const title = n.title.toLowerCase();
            const description = n.description.toLowerCase();
            const q = query.toLowerCase();

            if(title.includes(q) || description.includes(q)) return n;
        })

        // merge both the notes
        const fileredNotes = [...filteredPersonalNotes, ...filteredSharedNotes];

        // check for valid results
        if(fileredNotes.length === 0) return res.status(200).json({message:NO_RESULTS});

        return res.status(200).json({fileredNotes});

    } catch (error) {
        
        console.log(error);
        return res.status(500).json({message:UNFORSEEN_ERROR});
    }
}