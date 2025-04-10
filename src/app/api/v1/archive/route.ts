import { asyncHandler } from "@/lib/asyncHandler";
import { noticeController } from "@/server/modules/notice/notice.controller";

export const GET = asyncHandler(noticeController.getArchived);
export const POST = asyncHandler(noticeController.autoArchive);
