import { asyncHandler } from "@/lib/asyncHandler";
import { noticeController } from "@/server/modules/notice/notice.controller";

export const GET = asyncHandler(noticeController.getById);
export const PUT = asyncHandler(noticeController.update);
export const DELETE = asyncHandler(noticeController.remove);
