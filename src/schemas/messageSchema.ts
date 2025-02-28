import { z } from "zod";


export const messagesSchema = z.object({
   content: z
   .string()
   .min(10, {message: 'message should be atleast 10 characters'})
   .max(300, {message: 'message should not exceed 300 characters'})
})