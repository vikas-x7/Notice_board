import { asyncHandler } from "@/lib/asyncHandler";
import { authController } from "@/server/modules/auth/auth.controller";

export const GET = asyncHandler(authController.me);
