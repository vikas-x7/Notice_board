import { badRequestError } from "@/lib/AppError";
import {
    MAX_ATTACHMENT_SIZE_BYTES,
    isAllowedAttachmentMimeType,
} from "@/lib/attachments";
import { uploadFile } from "@/lib/cloudinary";

export const uploadService = {
    async upload(file: File) {
        if (file.size === 0) {
            throw badRequestError("Empty files cannot be uploaded");
        }

        if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
            throw badRequestError("File size must be less than 10MB");
        }

        if (!isAllowedAttachmentMimeType(file.type)) {
            throw badRequestError("Only images (JPEG, PNG, GIF, WebP, SVG) and PDF files are allowed");
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        return uploadFile(buffer, file.name, file.type);
    },
};
