import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noticeService } from "../services/notice.service";
import type { NoticeFilters } from "../types/notice.types";
import toast from "react-hot-toast";

export function useNotices(filters: NoticeFilters = {}) {
    return useQuery({
        queryKey: ["notices", filters],
        queryFn: () => noticeService.list(filters),
    });
}

export function useNotice(id: number) {
    return useQuery({
        queryKey: ["notice", id],
        queryFn: () => noticeService.getById(id),
        enabled: !!id,
    });
}

export function usePinnedNotices() {
    return useQuery({
        queryKey: ["pinnedNotices"],
        queryFn: () => noticeService.getPinned(),
    });
}

export function useBookmarks() {
    return useQuery({
        queryKey: ["bookmarks"],
        queryFn: () => noticeService.getBookmarks(),
    });
}

export function useSubscriptions() {
    return useQuery({
        queryKey: ["subscriptions"],
        queryFn: () => noticeService.getSubscriptions(),
    });
}

export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboardStats"],
        queryFn: () => noticeService.getDashboardStats(),
    });
}

export function useArchivedNotices(search?: string) {
    return useQuery({
        queryKey: ["archivedNotices", search],
        queryFn: () => noticeService.getArchived({ search }),
    });
}

export function useToggleBookmark() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ noticeId, isBookmarked }: { noticeId: number; isBookmarked: boolean }) => {
            if (isBookmarked) {
                return noticeService.removeBookmark(noticeId);
            }
            return noticeService.addBookmark(noticeId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
        },
    });
}

export function useToggleSubscription() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ category, isSubscribed }: { category: string; isSubscribed: boolean }) => {
            if (isSubscribed) {
                return noticeService.unsubscribe(category);
            }
            return noticeService.subscribe(category);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
            toast.success(variables.isSubscribed ? `Unsubscribed from ${variables.category}` : `Subscribed to ${variables.category}!`);
        },
    });
}

export function useCreateNotice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: Record<string, unknown>) => noticeService.create(input as Partial<import("../types/notice.types").Notice>),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notices"] });
            queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
            toast.success("Notice posted!");
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { error?: string } } };
            toast.error(err.response?.data?.error || "Failed to create notice");
        },
    });
}

export function useUpdateNotice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: number; input: Record<string, unknown> }) =>
            noticeService.update(id, input as Partial<import("../types/notice.types").Notice>),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notices"] });
            queryClient.invalidateQueries({ queryKey: ["pinnedNotices"] });
            queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
            toast.success("Notice updated!");
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { error?: string } } };
            toast.error(err.response?.data?.error || "Failed to update");
        },
    });
}

export function useDeleteNotice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => noticeService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notices"] });
            queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
            toast.success("Notice deleted!");
        },
        onError: () => {
            toast.error("Failed to delete");
        },
    });
}
