import { z } from "zod";

export const usernameValidation = z.string().trim().min(2, {message: 'username must be atleast 2 characters'})

export const signUpSchema = z.object({
    username: usernameValidation,

    password: z.string().min(5, {message: 'password should be of minimum 5 characters'}).max(30, {message: 'password should not exceed 30 characters'}),

    email: z.string().email({message: 'invalid email adress'})
})