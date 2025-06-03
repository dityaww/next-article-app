import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, { message: "Username minimal 3 karakter" }),
  password: z.string()
  .min(6, { message: "Password minimal 6 karakter" })
  .regex(/[0-9]/,{ message: "Password harus mengandung angka"}),
});

export type LoginSchema = z.infer<typeof loginSchema>