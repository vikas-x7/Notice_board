import { z } from "zod/v4";

export const loginSchema = z.object({
    email: z.email("Valid email is required"),
    password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rollNo: z.string().min(1, "Roll number is required"),
    branch: z.string().min(1, "Branch is required"),
    year: z.string().min(1, "Year is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
