import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "application/pdf",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export function getFileType(mimeType: string): "image" | "pdf" {
    if (mimeType.startsWith("image/")) return "image";
    return "pdf";
}

export async function uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
): Promise<{ url: string; publicId: string; fileType: "image" | "pdf" }> {
    const fileType = getFileType(mimeType);
    const resourceType = fileType === "image" ? "image" : "raw";

    return new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
            {
                folder: "college-notice-board",
                resource_type: resourceType,
                public_id: `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
            },
            (error, result) => {
                if (error) reject(error);
                else
                    resolve({
                        url: result!.secure_url,
                        publicId: result!.public_id,
                        fileType,
                    });
            }
        );
        upload.end(fileBuffer);
    });
}

export { cloudinary };
