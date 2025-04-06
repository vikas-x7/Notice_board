"use client";
import Navbar from "@/client/home/Navbar";
import NoticeDetail from "@/client/home/NoticeDetail";
import { useRouter } from "next/navigation";

interface Notice {
  id: number;
  title: string;
  description: string;
  category: string;
  urgency: string;
  isPinned: boolean;
  isArchived: boolean;
  fileUrl?: string | null;
  fileName?: string | null;
  createdAt: string;
  expiryDate?: string | null;
  author: { id: number; name: string; department?: string | null };
}
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function NoticeDetailPage({
  notice,
  user,
}: {
  notice: Notice;
  user: User;
}) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-surface">
      <Navbar user={user} />
      <NoticeDetail notice={notice} onClose={() => router.back()} />
    </div>
  );
}
