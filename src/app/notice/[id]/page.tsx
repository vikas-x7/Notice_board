import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import NoticeDetailPage from "./NoticeDetailPage";

export default async function NoticePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const { id } = await params;
    const noticeId = parseInt(id);

    if (isNaN(noticeId)) redirect("/student/feed");

    const notice = await prisma.notice.findUnique({
        where: { id: noticeId },
        include: {
            author: {
                select: { id: true, name: true, department: true },
            },
        },
    });

    if (!notice) redirect("/student/feed");

    return <NoticeDetailPage notice={JSON.parse(JSON.stringify(notice))} user={user} />;
}
