import { asyncHandler } from "@/lib/asyncHandler";
import { dashboardController } from "@/server/modules/dashboard/dashboard.controller";

export const GET = asyncHandler(dashboardController.getStats);
