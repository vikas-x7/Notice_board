import { NextRequest, NextResponse } from "next/server";
import { uploadFile, ALLOWED_MIME_TYPES, AllowedMimeType } from "@/lib/cloudinary";
import { authenticate, requireRole } from "@/server/middleware/auth.middleware";

export async function POST(request: NextRequest) {
    try {
        const user = await authenticate();
        requireRole(user.role, "ADMIN", "SUPER_ADMIN");

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!ALLOWED_MIME_TYPES.includes(file.type as AllowedMimeType)) {
            return NextResponse.json({ error: "Invalid file type. Only images and PDFs are allowed." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadFile(buffer, file.name, file.type);

        return NextResponse.json({
            url: result.url,
            fileName: file.name,
            fileType: result.fileType,
        });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 });
    }
}
