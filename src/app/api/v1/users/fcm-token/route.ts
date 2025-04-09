import { NextResponse } from "next/server";
import { getCurrentUser, unauthorized, badRequest, success } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return unauthorized();

        const { fcmToken } = await req.json();

        if (!fcmToken || typeof fcmToken !== "string") {
            return badRequest("Valid fcmToken is required");
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { fcmToken },
        });

        return success({ message: "FCM token saved successfully" });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
