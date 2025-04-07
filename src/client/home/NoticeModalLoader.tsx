"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import NoticeDetail from "./NoticeDetail";

export default function NoticeModalLoader({ noticeId, onClose }: { noticeId: number; onClose: () => void }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["notice", noticeId],
        queryFn: async () => {
            const res = await axios.get(`/api/v1/notices/${noticeId}`);
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            </div>
        );
    }

    if (error || !data?.notice) {
        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-8 text-white" onClick={onClose}>
                <div className="bg-card p-6 rounded-xl border border-line" onClick={e => e.stopPropagation()}>
                    <h3 className="text-xl font-bold mb-2">Error</h3>
                    <p className="text-subtle mb-4">Could not load the notice details.</p>
                    <button onClick={onClose} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors">Close</button>
                </div>
            </div>
        );
    }

    return <NoticeDetail notice={data.notice} onClose={onClose} />;
}
