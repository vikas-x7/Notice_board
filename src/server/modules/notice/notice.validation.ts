import { z } from "zod/v4";

export const createNoticeSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    category: z.enum(["ACADEMIC", "PLACEMENT", "EVENTS", "SCHOLARSHIPS", "SPORTS", "HOSTEL", "GENERAL"]),
    urgency: z.enum(["NORMAL", "IMPORTANT", "URGENT"]).optional().default("NORMAL"),
    expiryDate: z.string().nullable().optional(),
    fileUrl: z.string().nullable().optional(),
    fileName: z.string().nullable().optional(),
    isPinned: z.boolean().optional().default(false),
});

export const updateNoticeSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    category: z.enum(["ACADEMIC", "PLACEMENT", "EVENTS", "SCHOLARSHIPS", "SPORTS", "HOSTEL", "GENERAL"]).optional(),
    urgency: z.enum(["NORMAL", "IMPORTANT", "URGENT"]).optional(),
    expiryDate: z.string().nullable().optional(),
    fileUrl: z.string().nullable().optional(),
    fileName: z.string().nullable().optional(),
    isPinned: z.boolean().optional(),
});

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>;
export type UpdateNoticeInput = z.infer<typeof updateNoticeSchema>;
