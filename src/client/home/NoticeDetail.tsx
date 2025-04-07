"use client";
import { FiX, FiCalendar, FiDownload, FiUser, FiFile, FiBookmark } from "react-icons/fi";
import { format } from "date-fns";

interface Notice {
    id: number;
    title: string;
    description: string;
    category: string;
    urgency: string;
    isPinned: boolean;
    isArchived: boolean;
    fileUrl?: string | null;
    fileName?: string | null;
    createdAt: string;
    expiryDate?: string | null;
    author: { name: string; department?: string | null };
}

const urgencyBadge: Record<string, string> = {
    URGENT: "bg-danger/15 text-danger",
    IMPORTANT: "bg-warning/15 text-warning",
    NORMAL: "bg-info/15 text-info",
};

export default function NoticeDetail({ notice, isBookmarked, onBookmark, onClose }: { notice: Notice; isBookmarked?: boolean; onBookmark?: (id: number) => void; onClose: () => void }) {
    const getDownloadUrl = (url?: string | null) => {
        if (!url) return "#";
        if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !url.includes('fl_attachment')) {
            return url.replace('/upload/', '/upload/fl_attachment/');
        }
        return url;
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-8 animate-fade-in" onClick={onClose}>
            <div className="bg-[#171615]  rounded-[3px] w-full max-w-[700px] max-h-[85vh] overflow-y-auto p-5 sm:p-8 animate-slide-up relative" onClick={(e) => e.stopPropagation()}>
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    {onBookmark && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onBookmark(notice.id); }}
                            className={`w-9 h-9 rounded-[10px] cursor-pointer flex items-center justify-center text-lg transition-all border ${isBookmarked ? "bg-primary/20 border-primary text-primary" : "bg-surface border-transparent text-subtle hover:text-white hover:bg-white/10"}`}
                            title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
                        >
                            <FiBookmark style={{ fill: isBookmarked ? "currentColor" : "none" }} />
                        </button>
                    )}
                    <button onClick={onClose} className="bg-surface text-subtle w-9 h-9 rounded-[10px] cursor-pointer flex items-center justify-center text-lg transition-all hover:bg-danger hover:text-white hover:border-danger">
                        <FiX />
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[0.7rem] font-semibold uppercase ${urgencyBadge[notice.urgency]}`}>{notice.urgency}</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[0.7rem] font-semibold uppercase bg-[#343332]/40 text-[#D6D5D4]">{notice.category}</span>
                    {notice.isPinned && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[0.7rem] font-semibold uppercase bg-warning/20 text-warning"> Pinned</span>}
                    {notice.isArchived && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[0.7rem] font-semibold uppercase bg-gray-500/20 text-gray-400">Archived</span>}
                </div>

                <h2 className="text-xl sm:text-2xl font-medium mb-4 pr-10 sm:pr-12 leading-snug">{notice.title}</h2>

                <div className="flex items-center gap-3 sm:gap-4 mb-4 flex-wrap">
                    <span className="text-[11px] sm:text-xs text-muted flex items-center gap-1"><FiUser className="text-sm shrink-0" /> {notice.author.name}{notice.author.department && ` • ${notice.author.department}`}</span>
                    <span className="text-[11px] sm:text-xs text-muted flex items-center gap-1"><FiCalendar className="text-sm shrink-0" /> Posted {format(new Date(notice.createdAt), "PPP")}</span>
                    {notice.expiryDate && <span className="text-[11px] sm:text-xs text-muted flex items-center gap-1">Expires {format(new Date(notice.expiryDate), "PPP")}</span>}
                </div>

                <div className="text-[0.95rem] text-subtle leading-loose my-5">
                    {notice.description.split("\n").map((para, i) => (<p key={i} className="mb-3">{para}</p>))}
                </div>

                {notice.fileUrl && (
                    <div className="mt-6 flex flex-col gap-4">
                        {(notice.fileName?.match(/\.(jpeg|jpg|png|gif|webp)$/i) || notice.fileUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i)) && (
                            <div className="w-full rounded-xl overflow-hidden border border-line bg-surface flex justify-center p-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={notice.fileUrl} alt={notice.fileName || "Notice Attachment"} className="max-w-full max-h-[400px] object-contain rounded-lg" />
                            </div>
                        )}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-3 px-4 bg-surface border border-line rounded-xl">
                            <div className="flex items-center gap-3 flex-1 min-w-0 w-full">
                                <div className="text-2xl text-[#D6D5D4] shrink-0"><FiFile /></div>
                                <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{notice.fileName || "Attachment"}</div></div>
                            </div>
                            <a href={getDownloadUrl(notice.fileUrl)} download={notice.fileName || "attachment"} target="_blank" rel="noopener noreferrer" className="py-2.5 px-4 bg-[#343332] text-white border-none rounded-lg cursor-pointer text-xs font-semibold transition-all hover:bg-[#232222] hover:-translate-y-0.5 no-underline flex items-center justify-center gap-1 w-full sm:w-auto shrink-0">
                                <FiDownload /> Download
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
