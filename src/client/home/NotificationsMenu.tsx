"use client";

import { useState, useRef, useEffect } from "react";
import { FiBell, FiCheckCircle } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import NoticeModalLoader from "./NoticeModalLoader";

export default function NotificationsMenu() {
    const [open, setOpen] = useState(false);
    const [selectedNoticeId, setSelectedNoticeId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const { data } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await axios.get("/api/v1/notifications");
            return res.data as { notifications: Record<string, unknown>[]; unreadCount: number };
        },
        refetchInterval: 30000,
    });

    const markAsRead = useMutation({
        mutationFn: async (id?: number) => {
            await axios.patch("/api/v1/notifications", id ? { notificationId: id } : {});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const notifications = data?.notifications || [];
    const unreadCount = data?.unreadCount || 0;

    const handleNotificationClick = (notif: Record<string, unknown>) => {
        if (!notif.isRead) {
            markAsRead.mutate(notif.id as number);
        }
        if (notif.link) {
            const linkStr = notif.link as string;
            const idMatch = linkStr.match(/\/notice\/(\d+)/);
            if (idMatch) {
                setOpen(false);
                setSelectedNoticeId(Number(idMatch[1]));
            } else {
                setOpen(false);
                router.push(linkStr);
            }
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="relative w-9 h-9 bg-surface border border-white/20 text-white rounded-[4px] cursor-pointer flex items-center justify-center text-lg hover:bg-white/25 hover:-translate-y-0.5 transition-all outline-none"
                title="Notifications"
            >
                <FiBell />
                {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[0.65rem] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute top-full -right-4 sm:right-0 mt-2 w-[calc(100vw-32px)] sm:w-[340px] max-w-[340px] max-h-[400px] overflow-y-auto bg-[#1D1C1B] border border-[#343332] rounded-[5px] shadow-[0_8px_30px_rgba(0,0,0,0.6)] z-50 flex flex-col custom-scrollbar">
                    <div className="p-3 border-b border-[#343332] flex justify-between items-center bg-[#232222] sticky top-0 z-10">
                        <span className="text-sm font-semibold text-white">Notifications</span>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAsRead.mutate(undefined)}
                                className="text-xs text-info hover:text-white transition-colors flex items-center gap-1"
                            >
                                <FiCheckCircle /> Mark all read
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-subtle">
                            You have no notifications.
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notif: Record<string, unknown>) => (
                                <button
                                    key={notif.id as number}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`p-3 border-b border-[#343332]/50 text-left transition-colors hover:bg-white/5 ${!notif.isRead ? "bg-white/5" : ""
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <p className={`text-sm ${!notif.isRead ? "font-semibold text-white" : "text-subtle"}`}>
                                                {notif.title as string}
                                            </p>
                                            <p className="text-xs text-subtle mt-1 line-clamp-2">
                                                {notif.message as string}
                                            </p>
                                        </div>
                                        {!notif.isRead && (
                                            <span className="w-2 h-2 rounded-full bg-info shrink-0 mt-1" />
                                        )}
                                    </div>
                                    <span className="text-[10px] text-muted block mt-2">
                                        {formatDistanceToNow(new Date(notif.createdAt as string | number | Date), { addSuffix: true })}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {selectedNoticeId && (
                <NoticeModalLoader
                    noticeId={selectedNoticeId}
                    onClose={() => setSelectedNoticeId(null)}
                />
            )}
        </div>
    );
}
