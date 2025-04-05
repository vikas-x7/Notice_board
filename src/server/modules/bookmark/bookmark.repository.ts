import { prisma } from "@/lib/prisma";

export const bookmarkRepository = {
    async findByUser(userId: number) {
        return prisma.bookmark.findMany({
            where: { userId },
            include: {
                notice: {
                    include: {
                        author: { select: { id: true, name: true, department: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    },

    async findUnique(userId: number, noticeId: number) {
        return prisma.bookmark.findUnique({
            where: { userId_noticeId: { userId, noticeId } },
        });
    },

    async create(userId: number, noticeId: number) {
        return prisma.bookmark.create({
            data: { userId, noticeId },
            include: { notice: true },
        });
    },

    async deleteByNotice(userId: number, noticeId: number) {
        return prisma.bookmark.deleteMany({
            where: { userId, noticeId },
        });
    },
};
