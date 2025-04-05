import { bookmarkRepository } from "./bookmark.repository";
import { badRequestError } from "@/lib/AppError";

export const bookmarkService = {
    async list(userId: number) {
        const bookmarks = await bookmarkRepository.findByUser(userId);
        return { bookmarks };
    },

    async add(userId: number, noticeId: number) {
        if (!noticeId) throw badRequestError("Notice ID is required");

        const existing = await bookmarkRepository.findUnique(userId, noticeId);
        if (existing) throw badRequestError("Already bookmarked");

        const bookmark = await bookmarkRepository.create(userId, noticeId);
        return { bookmark };
    },

    async remove(userId: number, noticeId: number) {
        if (isNaN(noticeId)) throw badRequestError("Valid notice ID is required");
        await bookmarkRepository.deleteByNotice(userId, noticeId);
        return { message: "Bookmark removed" };
    },
};
