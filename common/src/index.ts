import z from "zod"

export const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional()
})

export type SignUpType = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export type SignInType = z.infer<typeof signInSchema>

export const CreatePostSchema = z.object({
    title:z.string(),
    content:z.string()
})

export type CreatePostType = z.infer<typeof CreatePostSchema>

export const UpdatePostSchema = z.object({
    title:z.string().optional(),
    content:z.string().optional()
})

export type UpdatePostType = z.infer<typeof UpdatePostSchema>