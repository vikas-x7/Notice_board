"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/client/home/Navbar";
import NoticeCard from "@/client/home/NoticeCard";
import NoticeDetail from "@/client/home/NoticeDetail";
import toast from "react-hot-toast";
import { FiBookmark } from "react-icons/fi";

interface User { id: number; name: string; email: string; role: string; }
interface Notice { id: number; title: string; description: string; category: string; urgency: string; isPinned: boolean; isArchived: boolean; fileUrl?: string | null; fileName?: string | null; createdAt: string; expiryDate?: string | null; author: { id: number; name: string; department?: string | null }; }

export default function BookmarksPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [bookmarks, setBookmarks] = useState<{ id: number; notice: Notice }[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const [meRes, bmRes] = await Promise.all([fetch("/api/v1/auth/me"), fetch("/api/v1/bookmarks")]);
            if (!meRes.ok) { router.push("/login"); return; }
            setUser((await meRes.json()).user);
            if (bmRes.ok) setBookmarks((await bmRes.json()).bookmarks);
        } catch { toast.error("Failed"); }
        finally { setLoading(false); }
    }, [router]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleRemove = async (noticeId: number) => {
        try { await fetch(`/api/v1/bookmarks?noticeId=${noticeId}`, { method: "DELETE" }); setBookmarks(prev => prev.filter(b => b.notice.id !== noticeId)); toast.success("Removed"); } catch { toast.error("Failed"); }
    };

    const handleClick = async (noticeId: number) => {
        try { const res = await fetch(`/api/v1/notices/${noticeId}`); if (res.ok) setSelectedNotice((await res.json()).notice); } catch { toast.error("Failed"); }
    };

    if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center"><div className="w-8 h-8 border-3 border-line border-t-primary rounded-full animate-spin-slow" /></div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-surface">
            <Navbar user={user} />
            <div className="p-4 sm:p-8 max-w-[900px] mx-auto">
                <div className="mb-8"><h2 className="text-2xl font-bold mb-1 flex items-center gap-2"><FiBookmark /> My Bookmarks</h2><p className="text-subtle text-sm">{bookmarks.length} saved notices</p></div>
                <button onClick={() => router.push("/student/feed")} className="mb-4 py-2 px-3.5 bg-transparent border border-line text-subtle rounded-lg text-xs font-semibold cursor-pointer hover:bg-card hover:text-white transition-all">← Back to Feed</button>
                <div className="flex flex-col gap-3">
                    {bookmarks.length === 0 ? (
                        <div className="text-center py-12 text-muted"><div className="text-5xl mb-4 opacity-50">🔖</div><h3 className="text-lg mb-2 text-subtle">No bookmarks yet</h3><p className="text-sm">Bookmark notices from the feed.</p></div>
                    ) : bookmarks.map(bm => <NoticeCard key={bm.id} notice={bm.notice} isBookmarked onBookmark={handleRemove} onClick={handleClick} />)}
                </div>
            </div>
            {selectedNotice && <NoticeDetail notice={selectedNotice} onClose={() => setSelectedNotice(null)} />}
        </div>
    );
}
