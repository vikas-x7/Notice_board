import { asyncHandler } from "@/lib/asyncHandler";
import { userController } from "@/server/modules/user/user.controller";

export const DELETE = asyncHandler(userController.deleteUser);
