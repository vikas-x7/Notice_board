"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/client/home/Navbar";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";

interface User { id: number; name: string; email: string; role: string; department?: string; }
interface Notice { id: number; title: string; description: string; category: string; urgency: string; isPinned: boolean; isArchived: boolean; fileUrl?: string | null; fileName?: string | null; createdAt: string; expiryDate?: string | null; author: { id: number; name: string; department?: string | null }; }
interface Stats { myNotices: number; activeNotices: number; pinnedNotices: number; totalNotices: number; }

const CATEGORIES = ["ACADEMIC", "PLACEMENT", "EVENTS", "SCHOLARSHIPS", "SPORTS", "HOSTEL", "GENERAL"];
const URGENCIES = ["NORMAL", "IMPORTANT", "URGENT"];

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"create" | "notices">("create");
    const [form, setForm] = useState({ title: "", description: "", category: "ACADEMIC", urgency: "NORMAL", expiryDate: "", isPinned: false, fileUrl: null as string | null, fileName: null as string | null });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const [meRes, noticesRes, statsRes] = await Promise.all([fetch("/api/v1/auth/me"), fetch("/api/v1/notices?limit=100"), fetch("/api/v1/dashboard/stats")]);
            if (!meRes.ok) { router.push("/login"); return; }
            const meData = await meRes.json();
            if (meData.user.role === "STUDENT") { router.push("/student/feed"); return; }
            setUser(meData.user);
            const noticesData = await noticesRes.json();
            const myNotices = meData.user.role === "SUPER_ADMIN" ? noticesData.notices : noticesData.notices.filter((n: Notice) => n.author.id === meData.user.id);
            setNotices(myNotices);
            const statsData = await statsRes.json();
            setStats(statsData.stats);
        } catch { toast.error("Failed to load data"); }
        finally { setLoading(false); }
    }, [router]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSubmitting(true);
        try {
            let fileUrl = form.fileUrl;
            let fileName = form.fileName;

            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                const uploadRes = await fetch("/api/v1/upload", { method: "POST", body: formData });
                const uploadData = await uploadRes.json();
                if (!uploadRes.ok) { toast.error(uploadData.error || "Upload failed"); setSubmitting(false); return; }
                fileUrl = uploadData.url;
                fileName = uploadData.fileName;
            }

            const url = editingId ? `/api/v1/notices/${editingId}` : "/api/v1/notices";
            const payload = { ...form, expiryDate: form.expiryDate || null, fileUrl, fileName };
            const res = await fetch(url, { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            const data = await res.json();
            if (!res.ok) { toast.error(data.error || "Failed"); return; }
            toast.success(editingId ? "Updated!" : "Posted!");
            setForm({ title: "", description: "", category: "ACADEMIC", urgency: "NORMAL", expiryDate: "", isPinned: false, fileUrl: null, fileName: null });
            setSelectedFile(null);
            setEditingId(null); fetchData();
        } catch { toast.error("Something went wrong"); }
        finally { setSubmitting(false); }
    };

    const handleEdit = (n: Notice) => { setForm({ title: n.title, description: n.description, category: n.category, urgency: n.urgency, expiryDate: n.expiryDate ? new Date(n.expiryDate).toISOString().split("T")[0] : "", isPinned: n.isPinned, fileUrl: n.fileUrl || null, fileName: n.fileName || null }); setSelectedFile(null); setEditingId(n.id); setTab("create"); };
    const handleDelete = async (id: number) => { if (!confirm("Delete this notice?")) return; try { const res = await fetch(`/api/v1/notices/${id}`, { method: "DELETE" }); if (!res.ok) { const d = await res.json(); toast.error(d.error); return; } toast.success("Deleted!"); fetchData(); } catch { toast.error("Error"); } };
    const handleTogglePin = async (n: Notice) => { try { const res = await fetch(`/api/v1/notices/${n.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isPinned: !n.isPinned }) }); const d = await res.json(); if (!res.ok) { toast.error(d.error); return; } toast.success(n.isPinned ? "Unpinned!" : "Pinned!"); fetchData(); } catch { toast.error("Error"); } };

    const inputClass = "w-full py-3 px-3.5 bg-[#171615] border border-[#343332] rounded-[3px] text-white text-sm outline-none font-[inherit] transition-all focus:border-[#D6D5D4] placeholder:text-muted";
    const selectClass = "w-full py-3 px-3.5 bg-[#171615] border border-[#343332] rounded-[3px] text-white text-sm outline-none font-[inherit] transition-all focus:border-[#D6D5D4] cursor-pointer";

    if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center"><div className="w-8 h-8 border-3 border-line border-t-primary rounded-full animate-spin-slow" /></div>;
    if (!user) return null;

    const statIcons = [
        { icon: <FiFileText />, value: stats?.myNotices ?? 0, label: "My Notices", bg: "bg-[#343332] text-[#D6D5D4]" },
        { icon: <FiTrendingUp />, value: stats?.activeNotices ?? 0, label: "Active", bg: "bg-[#343332] text-[#D6D5D4]" },
        { icon: <BsPinAngle />, value: stats?.pinnedNotices ?? 0, label: "Pinned", bg: "bg-[#343332] text-[#D6D5D4]" },
        { icon: <FiCheckCircle />, value: stats?.totalNotices ?? 0, label: "Total Active", bg: "bg-[#343332] text-[#D6D5D4]" },
    ];

    return (
        <div className="min-h-screen bg-[#171615]">
            <Navbar user={user} />
            <div className="p-4 sm:p-8 max-w-[1200px] mx-auto text-[#D6D5D4]">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-1 text-white">{user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"} Dashboard</h2>
                    <p className="text-subtle text-sm">Welcome back, {user.name}{user.department ? ` • ${user.department}` : ""}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-8">
                    {statIcons.map((s, i) => (
                        <div key={i} className="bg-[#1D1C1B] border border-[#343332] rounded-[3px] p-5 transition-all hover:border-[#D6D5D4]/30">
                            <div className={`w-[42px] h-[42px] rounded-[10px] flex items-center justify-center text-xl mb-3 ${s.bg}`}>{s.icon}</div>
                            <div className="text-3xl font-extrabold leading-none mb-1 text-[#D6D5D4]">{s.value}</div>
                            <div className="text-xs text-muted uppercase tracking-wider">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] gap-1 mb-6 bg-[#1D1C1B] rounded-[3px] p-1 border border-[#343332]">
                    <button onClick={() => setTab("create")} className={`flex-1 whitespace-nowrap shrink-0 py-2 sm:py-2.5 px-2 sm:px-4 rounded-[3px] text-[11px] sm:text-sm font-semibold cursor-pointer flex items-center justify-center gap-1 border-none transition-all ${tab === "create" ? "bg-[#343332] text-white" : "bg-transparent text-muted hover:text-white"}`}>
                        <FiPlus /> <span className="max-sm:hidden">{editingId ? "Edit Notice" : "Create Notice"}</span><span className="sm:hidden">{editingId ? "Edit" : "Create"}</span>
                    </button>
                    <button onClick={() => setTab("notices")} className={`flex-1 whitespace-nowrap shrink-0 py-2 sm:py-2.5 px-2 sm:px-4 rounded-[3px] text-[11px] sm:text-sm font-semibold cursor-pointer flex items-center justify-center gap-1 border-none transition-all ${tab === "notices" ? "bg-[#343332] text-white" : "bg-transparent text-muted hover:text-white"}`}>
                        <FiFileText /> <span className="max-sm:hidden">My Notices</span><span className="sm:hidden">Notices</span> ({notices.length})
                    </button>
                    {user.role === "SUPER_ADMIN" && (
                        <button onClick={() => router.push("/admin/users")} className="flex-1 whitespace-nowrap shrink-0 py-2 sm:py-2.5 px-2 sm:px-4 rounded-[3px] text-[11px] sm:text-sm font-semibold cursor-pointer flex items-center justify-center gap-1 border-none bg-transparent text-muted hover:text-white transition-all">
                            <span className="max-sm:hidden">👥 Manage Users</span><span className="sm:hidden">👥 Users</span>
                        </button>
                    )}
                </div>

                {/* Create Form */}
                {tab === "create" && (
                    <div className="bg-[#1D1C1B] border border-[#343332] rounded-[3px] p-8 mb-8 animate-slide-up">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><FiPlus /> {editingId ? "Edit Notice" : "Post New Notice"}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-5"><label className="block text-xs font-semibold text-subtle mb-1.5 uppercase tracking-wider">Title</label><input type="text" placeholder="Enter notice title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className={inputClass} /></div>
                            <div className="mb-5"><label className="block text-xs font-semibold text-subtle mb-1.5 uppercase tracking-wider">Description</label><textarea placeholder="Enter notice description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={5} className={`${inputClass} resize-y min-h-[120px]`} /></div>
                            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                                <div className="mb-5"><label className="block text-xs font-semibold text-subtle mb-1.5 uppercase tracking-wider">Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={selectClass}>{CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}</select></div>
                                <div className="mb-5"><label className="block text-xs font-semibold text-subtle mb-1.5 uppercase tracking-wider">Urgency</label><select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })} className={selectClass}>{URGENCIES.map((u) => <option key={u} value={u}>{u.charAt(0) + u.slice(1).toLowerCase()}</option>)}</select></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1 items-end">
                                <div className="mb-5"><label className="block text-xs font-semibold text-subtle mb-1.5 uppercase tracking-wider">Expiry Date (optional)</label><input type="date" min={new Date().toISOString().split("T")[0]} value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className={inputClass} /></div>
                                <div className="mb-5"><label className="block text-xs font-semibold text-subtle mb-1.5 uppercase tracking-wider">Attachment (Image/PDF)</label><input type="file" accept="image/*,application/pdf" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className={`${inputClass} py-2!`} />
                                    {(selectedFile || form.fileName) && <div className="text-xs text-info mt-1 truncate">Current: {selectedFile?.name || form.fileName}</div>}
                                </div>
                            </div>
                            <div className="mb-5 flex items-center gap-2 pb-1 bg-surface p-3 rounded-[3px] border border-[#343332]"><input type="checkbox" checked={form.isPinned} onChange={(e) => setForm({ ...form, isPinned: e.target.checked })} className="accent-[#D6D5D4] w-[18px] h-[18px] cursor-pointer" id="pin-notice" /><label htmlFor="pin-notice" className="text-sm font-semibold cursor-pointer select-none">Pin this notice (max 3)</label></div>
                            <div className="flex gap-3 mt-2">
                                <button type="submit" disabled={submitting} className="py-3 px-6 bg-[#343332] text-[#D6D5D4] border-none rounded-[3px] text-sm font-semibold cursor-pointer transition-all hover:bg-[#232222] disabled:opacity-60">{submitting ? "Saving..." : editingId ? "Update Notice" : "Post Notice"}</button>
                                {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: "", description: "", category: "ACADEMIC", urgency: "NORMAL", expiryDate: "", isPinned: false, fileUrl: null, fileName: null }); setSelectedFile(null); }} className="py-3 px-6 bg-transparent border border-[#343332] text-subtle rounded-[3px] text-sm font-semibold cursor-pointer hover:bg-[#232222] hover:text-[#D6D5D4] hover:border-[#D6D5D4] transition-all">Cancel</button>}
                            </div>
                        </form>
                    </div>
                )}

                {/* Notice List */}
                {tab === "notices" && (
                    <div className="flex flex-col gap-3 animate-slide-up">
                        {notices.length === 0 ? (
                            <div className="text-center py-12 text-muted"><div className="text-5xl mb-4 opacity-50">📝</div><h3 className="text-lg mb-2 text-subtle">No notices yet</h3><p className="text-sm">Create your first notice.</p></div>
                        ) : notices.map((n) => (
                            <div key={n.id} className="bg-[#1D1C1B] border border-[#343332] rounded-[3px] py-4 px-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-[#D6D5D4]/30 hover:bg-[#232222]">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h4 className="text-[0.95rem] font-semibold truncate">{n.title}</h4>
                                        {n.isPinned && <span className="px-2 py-0.5 bg-warning/20 text-warning rounded-md text-[0.6rem] font-bold">📌 Pinned</span>}
                                    </div>
                                    <div className="flex gap-1.5 flex-wrap">
                                        <span className="px-2.5 py-0.5 rounded-md text-[0.7rem] font-semibold uppercase bg-[#343332]/40 text-[#D6D5D4]">{n.category}</span>
                                        <span className={`px-2.5 py-0.5 rounded-md text-[0.7rem] font-semibold uppercase ${n.urgency === "URGENT" ? "bg-danger/15 text-danger" : n.urgency === "IMPORTANT" ? "bg-warning/15 text-warning" : "bg-info/15 text-info"}`}>{n.urgency}</span>
                                        <span className="text-[0.7rem] text-muted">{new Date(n.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => handleTogglePin(n)} title={n.isPinned ? "Unpin" : "Pin"} className={`w-9 h-9 rounded-[3px] border bg-[#171615] flex items-center justify-center text-sm cursor-pointer transition-all hover:border-[#D6D5D4] ${n.isPinned ? "text-accent border-warning/30" : "text-subtle border-[#343332]"}`}>{n.isPinned ? <BsPinAngleFill /> : <BsPinAngle />}</button>
                                    <button onClick={() => handleEdit(n)} title="Edit" className="w-9 h-9 rounded-[3px] border border-[#343332] bg-[#171615] text-subtle flex items-center justify-center text-sm cursor-pointer transition-all hover:text-white hover:border-[#D6D5D4]"><FiEdit2 /></button>
                                    <button onClick={() => handleDelete(n.id)} title="Delete" className="w-9 h-9 rounded-[3px] border border-[#343332] bg-[#171615] text-subtle flex items-center justify-center text-sm cursor-pointer transition-all hover:text-danger hover:border-danger hover:bg-danger/15"><FiTrash2 /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
}
