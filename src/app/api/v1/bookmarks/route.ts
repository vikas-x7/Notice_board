import { asyncHandler } from "@/lib/asyncHandler";
import { bookmarkController } from "@/server/modules/bookmark/bookmark.controller";

export const GET = asyncHandler(bookmarkController.list);
export const POST = asyncHandler(bookmarkController.add);
export const DELETE = asyncHandler(bookmarkController.remove);
