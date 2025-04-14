import { inferAttachmentType } from "@/lib/attachments";

type AttachmentFields = {
    fileUrl?: string | null;
    fileName?: string | null;
};

export function presentNotice<T extends AttachmentFields>(notice: T) {
    return {
        ...notice,
        fileType: inferAttachmentType(notice.fileUrl, notice.fileName),
    };
}

export function presentNotices<T extends AttachmentFields>(notices: T[]) {
    return notices.map((notice) => presentNotice(notice));
}
