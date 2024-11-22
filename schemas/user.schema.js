import z from "zod"

export const userSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email("Parameter email tidak sesuai format"),
    password: z.string().min(8, "Password minimal terdiri dari 8 karakter"),
})