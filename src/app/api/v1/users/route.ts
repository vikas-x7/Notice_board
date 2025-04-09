import { asyncHandler } from "@/lib/asyncHandler";
import { userController } from "@/server/modules/user/user.controller";

export const GET = asyncHandler(userController.list);
export const POST = asyncHandler(userController.createAdmin);
