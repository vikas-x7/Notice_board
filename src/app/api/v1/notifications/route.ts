import { NextResponse } from "next/server";
import { getCurrentUser, unauthorized, success } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return unauthorized();

        const notifications = await prisma.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: 50, // Get last 50 notifications
        });

        const unreadCount = notifications.filter(n => !n.isRead).length;

        return success({ notifications, unreadCount });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return unauthorized();

        // Used to mark all as read or mark specific as read
        const body = await req.json().catch(() => ({}));

        if (body.notificationId) {
            await prisma.notification.updateMany({
                where: { userId: user.id, id: body.notificationId },
                data: { isRead: true }
            });
        } else {
            // Mark all as read
            await prisma.notification.updateMany({
                where: { userId: user.id, isRead: false },
                data: { isRead: true }
            });
        }

        return success({ message: "Notifications updated successfully" });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
