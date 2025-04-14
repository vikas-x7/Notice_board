import { noticeRepository } from "./notice.repository";
import { badRequestError, notFoundError, forbiddenError } from "@/lib/AppError";
import type { CreateNoticeInput, UpdateNoticeInput } from "./notice.validation";
import type { Category, Urgency } from "../../../../generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { messaging } from "@/lib/firebase-admin";

export const noticeService = {
    async list(filters: {
        category?: string;
        urgency?: string;
        search?: string;
        page?: number;
        limit?: number;
        includeCategoryCounts?: boolean;
    }) {
        const [{ notices, total }, categoryStats] = await Promise.all([
            noticeRepository.findMany(filters),
            filters.includeCategoryCounts
                ? noticeRepository.findCategoryCounts({
                    urgency: filters.urgency,
                    search: filters.search,
                    isPinned: false,
                })
                : Promise.resolve([]),
        ]);
        const page = filters.page || 1;
        const limit = filters.limit || 20;

        return {
            notices,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            ...(filters.includeCategoryCounts
                ? {
                    categoryCounts: Object.fromEntries(
                        categoryStats.map((stat) => [stat.category, stat._count.id]),
                    ),
                }
                : {}),
        };
    },

    async getById(id: number, userId?: number) {
        if (isNaN(id)) throw badRequestError("Invalid notice ID");

        const notice = userId
            ? await noticeRepository.findByIdWithBookmarks(id, userId)
            : await noticeRepository.findById(id);

        if (!notice) throw notFoundError("Notice not found");

        return {
            notice: {
                ...notice,
                isBookmarked: userId && "bookmarks" in notice ? (notice.bookmarks as { id: number }[]).length > 0 : false,
            },
        };
    },

    async create(input: CreateNoticeInput, authorId: number) {
        if (input.isPinned) {
            const pinnedCount = await noticeRepository.countPinned();
            if (pinnedCount >= 3) {
                throw badRequestError("Maximum 3 notices can be pinned. Unpin one first.");
            }
        }

        const notice = await noticeRepository.create({
            title: input.title,
            description: input.description,
            category: input.category as Category,
            urgency: (input.urgency || "NORMAL") as Urgency,
            expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
            fileUrl: input.fileUrl || null,
            fileName: input.fileName || null,
            isPinned: input.isPinned || false,
            authorId,
        });

        // Trigger an asynchronous FCM push notification to subscribed users
        try {
            const subscribers = await prisma.user.findMany({
                where: {
                    subscriptions: {
                        some: { category: input.category as Category }
                    }
                },
                select: { id: true, fcmToken: true }
            });

            if (subscribers.length > 0) {
                // Save to Notification database for UI bell icon
                await prisma.notification.createMany({
                    data: subscribers.map((sub) => ({
                        userId: sub.id,
                        title: `New Notice: ${input.category}`,
                        message: input.title,
                        link: `/notice/${notice.id}`
                    }))
                });

                const tokens = subscribers.map((s) => s.fcmToken).filter(Boolean) as string[];

                if (tokens.length > 0) {
                    await messaging.sendEachForMulticast({
                        tokens,
                        notification: {
                            title: `New Notice: ${input.category}`,
                            body: input.title,
                        },
                        data: {
                            noticeId: String(notice.id),
                        }
                    });
                    console.log(`FCM Payload sent to ${tokens.length} users.`);
                }
            }
        } catch (error) {
            console.error("FCM Notification failed to send:", error);
        }

        return { notice };
    },

    async update(id: number, input: UpdateNoticeInput, userId: number, userRole: string) {
        if (isNaN(id)) throw badRequestError("Invalid notice ID");

        const existing = await noticeRepository.findById(id);
        if (!existing) throw notFoundError("Notice not found");

        if (existing.authorId !== userId && userRole !== "SUPER_ADMIN") {
            throw forbiddenError("You can only edit your own notices");
        }

        if (input.isPinned && !existing.isPinned) {
            const pinnedCount = await noticeRepository.countPinned();
            if (pinnedCount >= 3) {
                throw badRequestError("Maximum 3 notices can be pinned. Unpin one first.");
            }
        }

        const data: Record<string, unknown> = {};
        if (input.title) data.title = input.title;
        if (input.description) data.description = input.description;
        if (input.category) data.category = input.category;
        if (input.urgency) data.urgency = input.urgency;
        if (input.expiryDate !== undefined) data.expiryDate = input.expiryDate ? new Date(input.expiryDate) : null;
        if (input.fileUrl !== undefined) data.fileUrl = input.fileUrl;
        if (input.fileName !== undefined) data.fileName = input.fileName;
        if (input.isPinned !== undefined) data.isPinned = input.isPinned;

        const notice = await noticeRepository.update(id, data);
        return { notice };
    },

    async remove(id: number, userId: number, userRole: string) {
        if (isNaN(id)) throw badRequestError("Invalid notice ID");

        const existing = await noticeRepository.findById(id);
        if (!existing) throw notFoundError("Notice not found");

        if (existing.authorId !== userId && userRole !== "SUPER_ADMIN") {
            throw forbiddenError("You can only delete your own notices");
        }

        await noticeRepository.delete(id);
        return { message: "Notice deleted successfully" };
    },

    async getPinned() {
        const notices = await noticeRepository.findPinned();
        return { notices };
    },

    async pin(noticeId: number) {
        const pinnedCount = await noticeRepository.countPinned();
        if (pinnedCount >= 3) {
            throw badRequestError("Maximum 3 notices can be pinned. Unpin one first.");
        }
        const notice = await noticeRepository.update(noticeId, { isPinned: true });
        return { notice };
    },

    async unpin(noticeId: number) {
        const notice = await noticeRepository.update(noticeId, { isPinned: false });
        return { notice };
    },

    async getArchived(filters: { search?: string; page?: number; limit?: number }) {
        const { notices, total } = await noticeRepository.findMany({
            ...filters,
            isArchived: true,
        });
        const page = filters.page || 1;
        const limit = filters.limit || 20;

        return {
            notices,
            pagination: {
                page, limit, total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    async autoArchive() {
        const result = await noticeRepository.archiveExpired();
        return { message: `${result.count} notices archived`, count: result.count };
    },

    async search(query: string, includeArchived: boolean) {
        if (!query || query.trim().length === 0) {
            throw badRequestError("Search query is required");
        }
        const notices = await noticeRepository.search(query, includeArchived);
        return { notices, query };
    },
};
