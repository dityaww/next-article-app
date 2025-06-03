import { z } from "zod";

export const registerSchema = z.object({
  username: z.string()
  .min(3, { message: "Username minimal 3 karakter" }),
  password: z.string()
  .min(6, { message: "Password minimal 6 karakter" })
  .regex(/[0-9]/,{ message: "Password harus mengandung angka"}),
  role: z.string()
  .min(1, { message: "Pilih salah satu role" })
  .refine((value) => ["User", "Admin"].includes(value), { message: "Role tidak valid" })
});

export type RegisterSchema = z.infer<typeof registerSchema>