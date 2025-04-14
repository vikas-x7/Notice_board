import { NextRequest, NextResponse } from "next/server";
import { subscriptionService } from "./subscription.service";
import { authenticate } from "@/server/middleware/auth.middleware";

export const subscriptionController = {
    async list() {
        const user = await authenticate();
        const result = await subscriptionService.list(user.id);
        return NextResponse.json(result);
    },

    async subscribe(request: NextRequest) {
        const user = await authenticate();
        const body = await request.json();
        const result = await subscriptionService.subscribe(user.id, body.category);
        return NextResponse.json(result, { status: 201 });
    },

    async unsubscribe(request: NextRequest) {
        const user = await authenticate();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category") || "";
        const result = await subscriptionService.unsubscribe(user.id, category);
        return NextResponse.json(result);
    },
};
