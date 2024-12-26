import { z } from "zod";

export const createAccountSchema = z.object({
    name: z.string().min(1),
    email: z.string().email()
})

export const updateAccountSchema = createAccountSchema.partial()

export type ICreateAccount = z.infer<typeof createAccountSchema>
export type IUpdateAccount = z.infer<typeof updateAccountSchema>
