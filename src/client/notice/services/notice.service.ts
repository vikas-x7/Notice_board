import api from "@/lib/axios";
import type { Notice, Pagination, NoticeFilters, Bookmark, Subscription, DashboardStats } from "@/client/notice/types/notice.types";

export const noticeService = {
    async list(filters: NoticeFilters = {}) {
        const params = new URLSearchParams();
        if (filters.category && filters.category !== "ALL") params.set("category", filters.category);
        if (filters.urgency && filters.urgency !== "ALL") params.set("urgency", filters.urgency);
        if (filters.search) params.set("search", filters.search);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));

        const { data } = await api.get<{ notices: Notice[]; pagination: Pagination }>(`/notices?${params.toString()}`);
        return data;
    },

    async getById(id: number) {
        const { data } = await api.get<{ notice: Notice }>(`/notices/${id}`);
        return data;
    },

    async create(input: Partial<Notice>) {
        const { data } = await api.post<{ notice: Notice }>("/notices", input);
        return data;
    },

    async update(id: number, input: Partial<Notice>) {
        const { data } = await api.put<{ notice: Notice }>(`/notices/${id}`, input);
        return data;
    },

    async delete(id: number) {
        const { data } = await api.delete(`/notices/${id}`);
        return data;
    },

    // Pinned
    async getPinned() {
        const { data } = await api.get<{ notices: Notice[] }>("/pinned");
        return data;
    },

    async pin(noticeId: number) {
        const { data } = await api.post("/pinned", { noticeId });
        return data;
    },

    async unpin(noticeId: number) {
        const { data } = await api.delete(`/pinned?noticeId=${noticeId}`);
        return data;
    },

    // Archive
    async getArchived(filters: { search?: string; page?: number; limit?: number } = {}) {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        const { data } = await api.get<{ notices: Notice[]; pagination: Pagination }>(`/archive?${params.toString()}`);
        return data;
    },

    // Bookmarks
    async getBookmarks() {
        const { data } = await api.get<{ bookmarks: Bookmark[] }>("/bookmarks");
        return data;
    },

    async addBookmark(noticeId: number) {
        const { data } = await api.post("/bookmarks", { noticeId });
        return data;
    },

    async removeBookmark(noticeId: number) {
        const { data } = await api.delete(`/bookmarks?noticeId=${noticeId}`);
        return data;
    },

    // Subscriptions
    async getSubscriptions() {
        const { data } = await api.get<{ subscriptions: Subscription[] }>("/subscriptions");
        return data;
    },

    async subscribe(category: string) {
        const { data } = await api.post("/subscriptions", { category });
        return data;
    },

    async unsubscribe(category: string) {
        const { data } = await api.delete(`/subscriptions?category=${category}`);
        return data;
    },

    // Dashboard
    async getDashboardStats() {
        const { data } = await api.get<{ role: string; stats: DashboardStats }>("/dashboard/stats");
        return data;
    },

    // Search
    async search(query: string, archived = false) {
        const { data } = await api.get<{ notices: Notice[]; query: string }>(`/search?q=${encodeURIComponent(query)}${archived ? "&archived=true" : ""}`);
        return data;
    },

    // Users (admin)
    async getUsers() {
        const { data } = await api.get("/users");
        return data;
    },

    async createAdmin(input: { name: string; email: string; department: string }) {
        const { data } = await api.post("/users", input);
        return data;
    },

    async deleteUser(userId: number) {
        const { data } = await api.delete(`/users/${userId}`);
        return data;
    },

    // Upload
    async uploadFile(file: File) {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await api.post("/uploads", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    },
};
