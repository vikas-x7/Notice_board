export const ALLOWED_ATTACHMENT_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "application/pdf",
] as const;

export const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024;

export type AttachmentMimeType = (typeof ALLOWED_ATTACHMENT_MIME_TYPES)[number];
export type AttachmentType = "image" | "pdf";

const IMAGE_EXTENSION_PATTERN = /\.(?:jpe?g|png|gif|webp|svg)(?:$|[?#])/i;
const PDF_EXTENSION_PATTERN = /\.pdf(?:$|[?#])/i;

export function isAllowedAttachmentMimeType(value: string): value is AttachmentMimeType {
    return ALLOWED_ATTACHMENT_MIME_TYPES.includes(value as AttachmentMimeType);
}

export function getAttachmentTypeFromMimeType(mimeType: string): AttachmentType | null {
    if (mimeType === "application/pdf") return "pdf";
    if (mimeType.startsWith("image/")) return "image";
    return null;
}

export function inferAttachmentType(
    fileUrl?: string | null,
    fileName?: string | null,
): AttachmentType | null {
    if (fileName && IMAGE_EXTENSION_PATTERN.test(fileName)) return "image";
    if (fileName && PDF_EXTENSION_PATTERN.test(fileName)) return "pdf";
    if (fileUrl && IMAGE_EXTENSION_PATTERN.test(fileUrl)) return "image";
    if (fileUrl && PDF_EXTENSION_PATTERN.test(fileUrl)) return "pdf";
    return null;
}

export function sanitizeAttachmentFileName(fileName: string) {
    const sanitized = fileName
        .replace(/[\r\n"]/g, "")
        .replace(/[^a-zA-Z0-9._ -]/g, "_")
        .trim();

    return sanitized || "attachment";
}

export function ensureAttachmentFileName(
    fileName?: string | null,
    fileType?: AttachmentType | null,
) {
    if (fileName) return sanitizeAttachmentFileName(fileName);
    return fileType === "pdf" ? "attachment.pdf" : "attachment";
}
