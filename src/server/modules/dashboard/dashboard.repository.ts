import { prisma } from "@/lib/prisma";

export const dashboardRepository = {
    async getSuperAdminStats() {
        const [totalAdmins, totalStudents, totalNotices, activeNotices, archivedNotices, categoryStats] =
            await Promise.all([
                prisma.user.count({ where: { role: "ADMIN" } }),
                prisma.user.count({ where: { role: "STUDENT" } }),
                prisma.notice.count(),
                prisma.notice.count({ where: { isArchived: false } }),
                prisma.notice.count({ where: { isArchived: true } }),
                prisma.notice.groupBy({
                    by: ["category"],
                    _count: { id: true },
                    where: { isArchived: false },
                }),
            ]);

        return {
            totalAdmins,
            totalStudents,
            totalNotices,
            activeNotices,
            archivedNotices,
            categoryStats: categoryStats.map((s) => ({ category: s.category, count: s._count.id })),
        };
    },

    async getAdminStats(userId: number) {
        const [myNotices, activeNotices, pinnedNotices, totalNotices] = await Promise.all([
            prisma.notice.count({ where: { authorId: userId } }),
            prisma.notice.count({ where: { authorId: userId, isArchived: false } }),
            prisma.notice.count({ where: { authorId: userId, isPinned: true } }),
            prisma.notice.count({ where: { isArchived: false } }),
        ]);

        return { myNotices, activeNotices, pinnedNotices, totalNotices };
    },

    async getStudentStats(userId: number) {
        const [totalNotices, bookmarkCount, subscriptionCount, categoryStats] = await Promise.all([
            prisma.notice.count({ where: { isArchived: false, isPinned: false } }),
            prisma.bookmark.count({ where: { userId } }),
            prisma.subscription.count({ where: { userId } }),
            prisma.notice.groupBy({
                by: ["category"],
                _count: { id: true },
                where: { isArchived: false, isPinned: false },
            }),
        ]);

        return {
            totalNotices,
            bookmarkCount,
            subscriptionCount,
            categoryStats: categoryStats.map((s) => ({ category: s.category, count: s._count.id })),
        };
    },
};
