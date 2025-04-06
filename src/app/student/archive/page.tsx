"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/client/home/Navbar";
import NoticeCard from "@/client/home/NoticeCard";
import NoticeDetail from "@/client/home/NoticeDetail";
import toast from "react-hot-toast";
import { FiArchive, FiSearch } from "react-icons/fi";

interface User { id: number; name: string; email: string; role: string; }
interface Notice { id: number; title: string; description: string; category: string; urgency: string; isPinned: boolean; isArchived: boolean; fileUrl?: string | null; fileName?: string | null; createdAt: string; expiryDate?: string | null; author: { id: number; name: string; department?: string | null }; }

export default function ArchivePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

    const fetchUser = useCallback(async () => {
        const res = await fetch("/api/v1/auth/me");
        if (!res.ok) { router.push("/login"); return; }
        setUser((await res.json()).user);
    }, [router]);

    const fetchArchive = useCallback(async () => {
        try {
            const p = new URLSearchParams();
            if (search) p.set("search", search);
            const res = await fetch(`/api/v1/archive?${p.toString()}`);
            if (res.ok) setNotices((await res.json()).notices);
        } catch { toast.error("Failed"); }
        finally { setLoading(false); }
    }, [search]);

    useEffect(() => { fetchUser(); }, [fetchUser]);
    useEffect(() => { if (user) fetchArchive(); }, [user, fetchArchive]);
    useEffect(() => { const t = setTimeout(() => { if (user) fetchArchive(); }, 400); return () => clearTimeout(t); }, [search, user, fetchArchive]);

    const handleClick = async (noticeId: number) => {
        try { const res = await fetch(`/api/v1/notices/${noticeId}`); if (res.ok) setSelectedNotice((await res.json()).notice); } catch { toast.error("Failed"); }
    };

    if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center"><div className="w-8 h-8 border-3 border-line border-t-primary rounded-full animate-spin-slow" /></div>;
    if (!user) return null;

    const backUrl = user.role === "STUDENT" ? "/student/feed" : "/admin/dashboard";

    return (
        <div className="min-h-screen bg-surface">
            <Navbar user={user} />
            <div className="p-4 sm:p-8 max-w-[900px] mx-auto">
                <div className="mb-8"><h2 className="text-2xl font-bold mb-1 flex items-center gap-2"><FiArchive /> Archived Notices</h2><p className="text-subtle text-sm">Expired notices</p></div>
                <div className="flex gap-3 mb-6 items-center">
                    <button onClick={() => router.push(backUrl)} className="py-2 px-3.5 bg-transparent border border-line text-subtle rounded-lg text-xs font-semibold cursor-pointer hover:bg-card hover:text-white transition-all">← Back</button>
                    <div className="relative flex-1 max-w-[400px]">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                        <input type="text" placeholder="Search archived..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full py-2.5 pl-10 pr-3.5 bg-card border border-line rounded-xl text-white text-sm outline-none focus:border-primary transition-all placeholder:text-muted" />
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    {notices.length === 0 ? (
                        <div className="text-center py-12 text-muted"><div className="text-5xl mb-4 opacity-50">📦</div><h3 className="text-lg mb-2 text-subtle">No archived notices</h3><p className="text-sm">Expired notices will appear here.</p></div>
                    ) : notices.map(n => <NoticeCard key={n.id} notice={n} onClick={handleClick} />)}
                </div>
            </div>
            {selectedNotice && <NoticeDetail notice={selectedNotice} onClose={() => setSelectedNotice(null)} />}
        </div>
    );
}
