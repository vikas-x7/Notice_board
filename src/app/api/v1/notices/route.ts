import { asyncHandler } from "@/lib/asyncHandler";
import { noticeController } from "@/server/modules/notice/notice.controller";

export const GET = asyncHandler(noticeController.list);
export const POST = asyncHandler(noticeController.create);
