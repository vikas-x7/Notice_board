import { NextResponse } from "next/server";
import { dashboardService } from "./dashboard.service";
import { authenticate } from "@/server/middleware/auth.middleware";

export const dashboardController = {
    async getStats() {
        const user = await authenticate();
        const result = await dashboardService.getStats(user.id, user.role);
        return NextResponse.json(result);
    },
};
