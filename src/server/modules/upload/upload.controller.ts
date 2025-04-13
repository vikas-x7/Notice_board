import { NextRequest, NextResponse } from "next/server";
import { authenticate, requireRole } from "@/server/middleware/auth.middleware";
import { uploadFile, ALLOWED_MIME_TYPES } from "@/lib/cloudinary";
import { badRequestError } from "@/lib/AppError";

export const uploadController = {
    async upload(request: NextRequest) {
        const user = await authenticate();
        requireRole(user.role, "ADMIN", "SUPER_ADMIN");

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) throw badRequestError("No file provided");
        if (file.size > 10 * 1024 * 1024) throw badRequestError("File size must be less than 10MB");

        const mimeType = file.type;
        if (!ALLOWED_MIME_TYPES.includes(mimeType as (typeof ALLOWED_MIME_TYPES)[number])) {
            throw badRequestError("Only images (JPEG, PNG, GIF, WebP, SVG) and PDF files are allowed");
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const result = await uploadFile(buffer, file.name, mimeType);

        return NextResponse.json({
            url: result.url,
            fileName: file.name,
            publicId: result.publicId,
            fileType: result.fileType,
        });
    },
};
