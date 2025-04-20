import { z } from "zod/v4";

export const createNoticeSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    category: z.enum(["ACADEMIC", "PLACEMENT", "EVENTS", "SCHOLARSHIPS", "SPORTS", "HOSTEL", "GENERAL"]),
    urgency: z.enum(["NORMAL", "IMPORTANT", "URGENT"]).optional().default("NORMAL"),
    expiryDate: z.string().optional().default(""),
    isPinned: z.boolean().optional().default(false),
});

export const createAdminSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Valid email is required"),
    department: z.string().min(1, "Department is required"),
});

export type CreateNoticeFormData = z.infer<typeof createNoticeSchema>;
export type CreateAdminFormData = z.infer<typeof createAdminSchema>;
