import { asyncHandler } from "@/lib/asyncHandler";
import { uploadController } from "@/server/modules/upload/upload.controller";

export const POST = asyncHandler(uploadController.upload);
