import { NextRequest, NextResponse } from "next/server";
import { noticeService } from "./notice.service";
import { createNoticeSchema, updateNoticeSchema } from "./notice.validation";
import { authenticate, optionalAuth, requireRole } from "@/server/middleware/auth.middleware";

export const noticeController = {
    async list(request: NextRequest) {
        const { searchParams } = new URL(request.url);
        const result = await noticeService.list({
            category: searchParams.get("category") || undefined,
            urgency: searchParams.get("urgency") || undefined,
            search: searchParams.get("search") || undefined,
            page: parseInt(searchParams.get("page") || "1"),
            limit: parseInt(searchParams.get("limit") || "20"),
            includeCategoryCounts: searchParams.get("includeCategoryCounts") === "true",
        });
        return NextResponse.json(result);
    },

    async getById(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
        const { id } = await params;
        const user = await optionalAuth();
        const result = await noticeService.getById(parseInt(id), user?.id);
        return NextResponse.json(result);
    },

    async create(request: NextRequest) {
        const user = await authenticate();
        requireRole(user.role, "ADMIN", "SUPER_ADMIN");

        const body = await request.json();
        const input = createNoticeSchema.parse(body);
        const result = await noticeService.create(input, user.id);
        return NextResponse.json(result, { status: 201 });
    },

    async update(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
        const user = await authenticate();
        requireRole(user.role, "ADMIN", "SUPER_ADMIN");

        const { id } = await params;
        const body = await request.json();
        const input = updateNoticeSchema.parse(body);
        const result = await noticeService.update(parseInt(id), input, user.id, user.role);
        return NextResponse.json(result);
    },

    async remove(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
        const user = await authenticate();
        requireRole(user.role, "ADMIN", "SUPER_ADMIN");

        const { id } = await params;
        const result = await noticeService.remove(parseInt(id), user.id, user.role);
        return NextResponse.json(result);
    },

    // Pinned
    async getPinned() {
        const result = await noticeService.getPinned();
        return NextResponse.json(result);
    },

    async pin(request: NextRequest) {
        await authenticate();
        const body = await request.json();
        if (!body.noticeId) {
            return NextResponse.json({ error: "Notice ID is required" }, { status: 400 });
        }
        const result = await noticeService.pin(body.noticeId);
        return NextResponse.json(result);
    },

    async unpin(request: NextRequest) {
        await authenticate();
        const { searchParams } = new URL(request.url);
        const noticeId = parseInt(searchParams.get("noticeId") || "");
        if (isNaN(noticeId)) {
            return NextResponse.json({ error: "Valid notice ID is required" }, { status: 400 });
        }
        const result = await noticeService.unpin(noticeId);
        return NextResponse.json(result);
    },

    // Archive
    async getArchived(request: NextRequest) {
        const { searchParams } = new URL(request.url);
        const result = await noticeService.getArchived({
            search: searchParams.get("search") || undefined,
            page: parseInt(searchParams.get("page") || "1"),
            limit: parseInt(searchParams.get("limit") || "20"),
        });
        return NextResponse.json(result);
    },

    async autoArchive() {
        const result = await noticeService.autoArchive();
        return NextResponse.json(result);
    },

    // Search
    async search(request: NextRequest) {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q") || "";
        const includeArchived = searchParams.get("archived") === "true";
        const result = await noticeService.search(query, includeArchived);
        return NextResponse.json(result);
    },
};
