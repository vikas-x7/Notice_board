import { asyncHandler } from "@/lib/asyncHandler";
import { noticeController } from "@/server/modules/notice/notice.controller";

export const runtime = "nodejs";
export const GET = asyncHandler(noticeController.downloadAttachment);
