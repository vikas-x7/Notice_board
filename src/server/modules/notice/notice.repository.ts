import { prisma } from "@/lib/prisma";
import type { Category, Urgency } from "../../../../generated/prisma/enums";

const buildNoticeWhere = (
    filters: {
        category?: string;
        urgency?: string;
        search?: string;
        isArchived?: boolean;
        isPinned?: boolean;
        authorId?: number;
    },
    options: {
        includeCategory?: boolean;
    } = {},
) => {
    const { includeCategory = true } = options;
    const { category, urgency, search, isArchived = false, isPinned, authorId } = filters;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};
    const AND: any[] = [];

    if (isArchived === true) {
        AND.push({
            OR: [
                { isArchived: true },
                { expiryDate: { lt: new Date() } }
            ]
        });
    } else {
        AND.push({ isArchived: false });
        AND.push({
            OR: [
                { expiryDate: null },
                { expiryDate: { gte: new Date() } }
            ]
        });
    }

    if (includeCategory && category && category !== "ALL") AND.push({ category });
    if (urgency && urgency !== "ALL") AND.push({ urgency });
    if (isPinned !== undefined) AND.push({ isPinned });
    if (authorId) AND.push({ authorId });
    if (search) {
        AND.push({
            OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ]
        });
    }

    if (AND.length > 0) {
        where.AND = AND;
    }

    return where;
};

export const noticeRepository = {
    async findMany(filters: {
        category?: string;
        urgency?: string;
        search?: string;
        isArchived?: boolean;
        isPinned?: boolean;
        authorId?: number;
        page?: number;
        limit?: number;
    }) {
        const { page = 1, limit = 20 } = filters;
        const where = buildNoticeWhere(filters);

        const [notices, total] = await Promise.all([
            prisma.notice.findMany({
                where,
                include: {
                    author: { select: { id: true, name: true, department: true } },
                    _count: { select: { bookmarks: true } },
                },
                orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.notice.count({ where }),
        ]);

        return { notices, total };
    },

    async findCategoryCounts(filters: {
        urgency?: string;
        search?: string;
        isArchived?: boolean;
        isPinned?: boolean;
        authorId?: number;
    }) {
        const where = buildNoticeWhere(filters, { includeCategory: false });

        return prisma.notice.groupBy({
            by: ["category"],
            _count: { id: true },
            where,
        });
    },

    async findById(id: number) {
        return prisma.notice.findUnique({
            where: { id },
            include: {
                author: { select: { id: true, name: true, department: true } },
                _count: { select: { bookmarks: true } },
            },
        });
    },

    async findByIdWithBookmarks(id: number, userId: number) {
        return prisma.notice.findUnique({
            where: { id },
            include: {
                author: { select: { id: true, name: true, department: true } },
                _count: { select: { bookmarks: true } },
                bookmarks: {
                    where: { userId },
                    select: { id: true },
                },
            },
        });
    },

    async create(data: {
        title: string;
        description: string;
        category: Category;
        urgency: Urgency;
        expiryDate?: Date | null;
        fileUrl?: string | null;
        fileName?: string | null;
        isPinned: boolean;
        authorId: number;
    }) {
        return prisma.notice.create({
            data,
            include: {
                author: { select: { id: true, name: true, department: true } },
            },
        });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async update(id: number, data: Record<string, any>) {
        return prisma.notice.update({
            where: { id },
            data,
            include: {
                author: { select: { id: true, name: true, department: true } },
            },
        });
    },

    async delete(id: number) {
        return prisma.notice.delete({ where: { id } });
    },

    async countPinned() {
        return prisma.notice.count({
            where: buildNoticeWhere({ isPinned: true, isArchived: false }),
        });
    },

    async findPinned() {
        return prisma.notice.findMany({
            where: buildNoticeWhere({ isPinned: true, isArchived: false }),
            include: {
                author: { select: { id: true, name: true, department: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 3,
        });
    },

    async archiveExpired() {
        return prisma.notice.updateMany({
            where: {
                isArchived: false,
                expiryDate: { lt: new Date() },
            },
            data: { isArchived: true },
        });
    },

    async search(query: string, includeArchived: boolean) {
        const where = buildNoticeWhere({ search: query, isArchived: includeArchived });

        return prisma.notice.findMany({
            where,
            include: {
                author: { select: { id: true, name: true, department: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 20,
        });
    },
};
