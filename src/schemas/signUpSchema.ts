import { string, z } from "zod";

export const usernameValidation = z.string().trim().min(2, {message: 'username must be atleast 2 characters'}).max(20, {message: 'username should not exceed 20 characters'}).refine((username) => !/[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\-]$/.test(username), {
    message: "username should not end with a special character",
  });

export const signUpSchema = z.object({
    username: usernameValidation,

    password: z.string().min(5, {message: 'password should be of minimum 5 characters'}).max(30, {message: 'password should not exceed 30 characters'}),

    email: z.string().email({message: 'invalid email adress'}).includes('@', {message: 'email should contain @ symbol'}).endsWith('.com', {message: 'email should end with .com'}).includes('gmail', {message: "email should contain 'gmail' "}),
})