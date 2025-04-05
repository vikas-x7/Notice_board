import { prisma } from "@/lib/prisma";

export const subscriptionRepository = {
    async findByUser(userId: number) {
        return prisma.subscription.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    },

    async findUnique(userId: number, category: string) {
        return prisma.subscription.findUnique({
            where: {
                userId_category: {
                    userId,
                    category: category as "ACADEMIC" | "PLACEMENT" | "EVENTS" | "SCHOLARSHIPS" | "SPORTS" | "HOSTEL" | "GENERAL",
                },
            },
        });
    },

    async create(userId: number, category: string) {
        return prisma.subscription.create({
            data: { userId, category: category as "ACADEMIC" | "PLACEMENT" | "EVENTS" | "SCHOLARSHIPS" | "SPORTS" | "HOSTEL" | "GENERAL" },
        });
    },

    async deleteByCategory(userId: number, category: string) {
        return prisma.subscription.deleteMany({
            where: {
                userId,
                category: category as "ACADEMIC" | "PLACEMENT" | "EVENTS" | "SCHOLARSHIPS" | "SPORTS" | "HOSTEL" | "GENERAL",
            },
        });
    },
};
