import z from 'zod'

// using zod for validating incomimg requests 
// and error handling

export const AuthInputProps = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(16)
})

export const createNotesProps = z.object({
    title: z.string(),
    description: z.string(),
})

export const EditNotesProps = z.object({
    title: z.string().optional(),
    description: z.string().optional()
})

export const ShareNotesProps = z.object({
    toUserId: z.string(),
})