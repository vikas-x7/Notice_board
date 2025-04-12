import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.validation";
import { authenticate } from "@/server/middleware/auth.middleware";

function setCookie(cookieStore: Awaited<ReturnType<typeof cookies>>, token: string) {
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });
}

export const authController = {
    async login(request: NextRequest) {
        const body = await request.json();
        const input = loginSchema.parse(body);
        const result = await authService.login(input);

        const cookieStore = await cookies();
        setCookie(cookieStore, result.token);

        return NextResponse.json(result);
    },

    async register(request: NextRequest) {
        const body = await request.json();
        const input = registerSchema.parse(body);
        const result = await authService.register(input);

        const cookieStore = await cookies();
        setCookie(cookieStore, result.token);

        return NextResponse.json(result, { status: 201 });
    },

    async me() {
        const user = await authenticate();
        return NextResponse.json({ user });
    },

    async logout() {
        const cookieStore = await cookies();
        cookieStore.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 0,
            path: "/",
        });
        return NextResponse.json({ message: "Logged out successfully" });
    },
};
