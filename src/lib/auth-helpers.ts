import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { prisma } from "./prisma";
import { NextResponse } from "next/server";

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
            rollNo: true,
            branch: true,
            year: true,
            isVerified: true,
            tempPassword: true,
            createdAt: true,
        },
    });

    return user;
}

export function unauthorized(message = "Unauthorized") {
    return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
    return NextResponse.json({ error: message }, { status: 403 });
}

export function badRequest(message: string) {
    return NextResponse.json({ error: message }, { status: 400 });
}

export function success(data: unknown, status = 200) {
    return NextResponse.json(data, { status });
}
