"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/client/home/Navbar";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiUsers, FiShield, FiUserCheck } from "react-icons/fi";

interface User { id: number; name: string; email: string; role: string; department?: string; rollNo?: string; branch?: string; year?: string; createdAt: string; }
interface Stats { totalAdmins: number; totalStudents: number; totalNotices: number; }

export default function UsersPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", department: "" });
    const [creating, setCreating] = useState(false);
    const [tempPassword, setTempPassword] = useState("");

    const fetchData = useCallback(async () => {
        try {
            const [meRes, usersRes, statsRes] = await Promise.all([fetch("/api/v1/auth/me"), fetch("/api/v1/users"), fetch("/api/v1/dashboard/stats")]);
            if (!meRes.ok) { router.push("/login"); return; }
            const meData = await meRes.json();
            if (meData.user.role !== "SUPER_ADMIN") { router.push("/admin/dashboard"); return; }
            setCurrentUser(meData.user);
            if (usersRes.ok) { const d = await usersRes.json(); setUsers(d.users); }
            if (statsRes.ok) { const d = await statsRes.json(); setStats(d.stats); }
        } catch { toast.error("Failed to load data"); }
        finally { setLoading(false); }
    }, [router]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault(); setCreating(true); setTempPassword("");
        try {
            const res = await fetch("/api/v1/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            const data = await res.json();
            if (!res.ok) { toast.error(data.error); return; }
            toast.success("Admin created!"); setTempPassword(data.tempPassword); setForm({ name: "", email: "", department: "" }); fetchData();
        } catch { toast.error("Error"); }
        finally { setCreating(false); }
    };

    const handleDelete = async (userId: number) => {
        if (!confirm("Delete this user?")) return;
        try { const res = await fetch(`/api/v1/users/${userId}`, { method: "DELETE" }); if (!res.ok) { const d = await res.json(); toast.error(d.error); return; } toast.success("Deleted!"); fetchData(); } catch { toast.error("Error"); }
    };

    const inputClass = "w-full py-3 px-3.5 bg-[#171615] border border-[#343332] rounded-[3px] text-white text-sm outline-none font-[inherit] transition-all focus:border-[#D6D5D4] placeholder:text-muted";

    if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center"><div className="w-8 h-8 border-3 border-line border-t-primary rounded-full animate-spin-slow" /></div>;
    if (!currentUser) return null;

    const admins = users.filter(u => u.role === "ADMIN");
    const students = users.filter(u => u.role === "STUDENT");

    return (
        <div className="min-h-screen bg-[#171615]">
            <Navbar user={currentUser} />
            <div className="p-8 max-w-[1200px] mx-auto text-[#D6D5D4]">
                <div className="mb-8"><h2 className="text-2xl font-bold mb-1 text-white">User Management</h2><p className="text-subtle text-sm">Manage admin accounts and view all users</p></div>

                {stats && (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-8">
                        {[{ i: <FiShield />, v: stats.totalAdmins, l: "Admins", c: "bg-[#343332] text-[#D6D5D4]" }, { i: <FiUsers />, v: stats.totalStudents, l: "Students", c: "bg-[#343332] text-[#D6D5D4]" }, { i: <FiUserCheck />, v: stats.totalNotices, l: "Notices", c: "bg-[#343332] text-[#D6D5D4]" }].map((s, i) => (
                            <div key={i} className="bg-[#1D1C1B] border border-[#343332] rounded-[3px] p-5 transition-all hover:border-[#D6D5D4]/30">
                                <div className={`w-[42px] h-[42px] rounded-[10px] flex items-center justify-center text-xl mb-3 ${s.c}`}>{s.i}</div>
                                <div className="text-3xl font-extrabold leading-none mb-1 text-[#D6D5D4]">{s.v}</div>
                                <div className="text-xs text-muted uppercase tracking-wider">{s.l}</div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-3 mb-6">
                    <button onClick={() => setShowForm(!showForm)} className="py-3 px-6 bg-[#343332] text-[#D6D5D4] border-none rounded-[3px] text-sm font-semibold cursor-pointer transition-all hover:bg-[#232222] inline-flex items-center gap-2"><FiPlus /> Create Admin</button>
                    <button onClick={() => router.push("/admin/dashboard")} className="py-3 px-6 bg-transparent border border-[#343332] text-subtle rounded-[3px] text-sm font-semibold cursor-pointer hover:bg-[#232222] hover:text-[#D6D5D4] transition-all">← Dashboard</button>
                </div>

                {showForm && (
                    <div className="bg-[#1D1C1B] border border-[#343332] rounded-[3px] p-8 mb-8 animate-slide-up">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><FiPlus /> Create Admin</h3>
                        <form onSubmit={handleCreate}>
                            <div className="mb-4"><label className="block text-xs font-semibold text-subtle mb-1.5 uppercase tracking-wider">Full Name</label><input type="text" placeholder="Dr. Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputClass} /></div>
                            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                                <div className="mb-4"><label className="block text-xs font-semibold text-subtle mb-1.5 uppercase tracking-wider">Email</label><input type="email" placeholder="sharma@college.edu" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className={inputClass} /></div>
                                <div className="mb-4"><label className="block text-xs font-semibold text-subtle mb-1.5 uppercase tracking-wider">Department</label><input type="text" placeholder="Exam Cell" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required className={inputClass} /></div>
                            </div>
                            <button type="submit" disabled={creating} className="py-3 px-6 bg-[#343332] text-[#D6D5D4] border-none rounded-[3px] text-sm font-semibold cursor-pointer transition-all disabled:opacity-60 hover:bg-[#232222]">{creating ? "Creating..." : "Create Admin"}</button>
                        </form>
                        {tempPassword && <div className="mt-4 bg-success/15 text-success py-2.5 px-3.5 rounded-lg text-sm border border-success/30">✅ Temp password: <strong className="font-mono text-base select-all">{tempPassword}</strong><br />Share this with the admin.</div>}
                    </div>
                )}

                {/* Admins */}
                <div className="mb-8">
                    <h3 className="text-base font-semibold mb-3 flex items-center gap-1.5"><FiShield /> Admins ({admins.length})</h3>
                    <div className="flex flex-col gap-2">
                        {admins.map(u => (
                            <div key={u.id} className="bg-[#1D1C1B] border border-[#343332] rounded-[3px] py-4 px-5 flex justify-between items-center transition-all hover:border-[#D6D5D4]/30 hover:bg-[#232222]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#343332]/40 rounded-[3px] flex items-center justify-center font-bold text-sm text-[#D6D5D4]">{u.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}</div>
                                    <div><h4 className="text-[0.95rem] font-semibold text-[#D6D5D4]">{u.name}</h4><p className="text-xs text-muted">{u.email}{u.department ? ` • ${u.department}` : ""}</p></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 rounded-[3px] text-[0.65rem] font-bold uppercase bg-[#343332]/40 text-[#D6D5D4]">Admin</span>
                                    <button onClick={() => handleDelete(u.id)} className="w-9 h-9 rounded-[3px] border border-[#343332] bg-[#171615] text-subtle flex items-center justify-center text-sm cursor-pointer transition-all hover:text-danger hover:border-danger hover:bg-danger/15"><FiTrash2 /></button>
                                </div>
                            </div>
                        ))}
                        {admins.length === 0 && <div className="text-center py-8 text-muted text-sm">No admins yet.</div>}
                    </div>
                </div>

                {/* Students */}
                <div>
                    <h3 className="text-base font-semibold mb-3 flex items-center gap-1.5"><FiUsers /> Students ({students.length})</h3>
                    <div className="flex flex-col gap-2">
                        {students.map(u => (
                            <div key={u.id} className="bg-[#1D1C1B] border border-[#343332] rounded-[3px] py-4 px-5 flex justify-between items-center transition-all hover:border-[#D6D5D4]/30 hover:bg-[#232222]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#343332]/40 rounded-[3px] flex items-center justify-center font-bold text-sm text-[#D6D5D4]">{u.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}</div>
                                    <div><h4 className="text-[0.95rem] font-semibold text-[#D6D5D4]">{u.name}</h4><p className="text-xs text-muted">{u.email}{u.rollNo ? ` • ${u.rollNo}` : ""}{u.branch ? ` • ${u.branch}` : ""}{u.year ? ` • ${u.year}` : ""}</p></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 rounded-[3px] text-[0.65rem] font-bold uppercase bg-[#343332]/40 text-[#D6D5D4]">Student</span>
                                    <button onClick={() => handleDelete(u.id)} className="w-9 h-9 rounded-[3px] border border-[#343332] bg-[#171615] text-subtle flex items-center justify-center text-sm cursor-pointer transition-all hover:text-danger hover:border-danger hover:bg-danger/15"><FiTrash2 /></button>
                                </div>
                            </div>
                        ))}
                        {students.length === 0 && <div className="text-center py-8 text-muted text-sm">No students yet.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
