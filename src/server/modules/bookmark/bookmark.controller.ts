import { NextRequest, NextResponse } from "next/server";
import { bookmarkService } from "./bookmark.service";
import { authenticate } from "@/server/middleware/auth.middleware";

export const bookmarkController = {
    async list() {
        const user = await authenticate();
        const result = await bookmarkService.list(user.id);
        return NextResponse.json(result);
    },

    async add(request: NextRequest) {
        const user = await authenticate();
        const body = await request.json();
        const result = await bookmarkService.add(user.id, body.noticeId);
        return NextResponse.json(result, { status: 201 });
    },

    async remove(request: NextRequest) {
        const user = await authenticate();
        const { searchParams } = new URL(request.url);
        const noticeId = parseInt(searchParams.get("noticeId") || "");
        const result = await bookmarkService.remove(user.id, noticeId);
        return NextResponse.json(result);
    },
};
