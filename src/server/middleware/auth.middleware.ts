import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { unauthorizedError } from "@/lib/AppError";

export async function authenticate() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw unauthorizedError();

    const payload = verifyToken(token);
    if (!payload) throw unauthorizedError();

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

    if (!user) throw unauthorizedError();

    return user;
}

export async function optionalAuth() {
    try {
        return await authenticate();
    } catch {
        return null;
    }
}

export function requireRole(userRole: string, ...allowedRoles: string[]) {
    if (!allowedRoles.includes(userRole)) {
        throw unauthorizedError("Insufficient permissions");
    }
}
