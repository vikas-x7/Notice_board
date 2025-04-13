import { NextRequest, NextResponse } from "next/server";
import { userService } from "./user.service";
import { authenticate, requireRole } from "@/server/middleware/auth.middleware";

export const userController = {
    async list() {
        const user = await authenticate();
        requireRole(user.role, "SUPER_ADMIN");
        const result = await userService.listAll();
        return NextResponse.json(result);
    },

    async createAdmin(request: NextRequest) {
        const user = await authenticate();
        requireRole(user.role, "SUPER_ADMIN");
        const body = await request.json();
        const result = await userService.createAdmin(body);
        return NextResponse.json(result, { status: 201 });
    },

    async deleteUser(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
        const user = await authenticate();
        requireRole(user.role, "SUPER_ADMIN");
        const { id } = await params;
        const result = await userService.deleteUser(parseInt(id));
        return NextResponse.json(result);
    },
};
