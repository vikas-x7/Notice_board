"use client";
import { FiCalendar, FiPaperclip, FiBookmark, FiBell } from "react-icons/fi";
import { BsPinAngle } from "react-icons/bs";
import { format } from "date-fns";

interface NoticeCardProps {
  notice: {
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
  };
  isBookmarked?: boolean;
  onBookmark?: (noticeId: number) => void;
  onClick?: (noticeId: number) => void;
  variant?: "default" | "pinned";
}

const urgencyBadge: Record<string, string> = {
  URGENT: "bg-danger/15 text-danger",
  IMPORTANT: "bg-warning/15 text-warning",
  NORMAL: "bg-info/15 text-info",
};

export default function NoticeCard({
  notice,
  isBookmarked = false,
  onBookmark,
  onClick,
  variant = "default",
}: NoticeCardProps) {
  if (variant === "pinned") {
    return (
      <div
        onClick={() => onClick?.(notice.id)}
        className="bg-card border border-line rounded-[3px] py-4 px-3 cursor-pointer transition-all duration-300 relative hover:bg-card-hover hover:border-[#343332] "
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] " />
        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-warning/20 rounded-md text-[0.65rem] font-bold text-white uppercase tracking-wider mb-2">
          <BsPinAngle /> Pinned
        </div>
        <h4 className="text-base font-semibold mb-2 leading-snug">
          {notice.title}
        </h4>
        <p className="text-[0.82rem] text-subtle leading-relaxed line-clamp-2 mb-3">
          {notice.description}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[0.7rem] font-semibold uppercase tracking-wider ${urgencyBadge[notice.urgency]}`}
          >
            {notice.urgency}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[0.7rem] font-semibold uppercase tracking-wider bg-[#343332]/40 text-[#D6D5D4]">
            {notice.category}
          </span>
          <span className="text-xs text-muted flex items-center gap-1">
            <FiCalendar className="text-[0.7rem]" />
            {notice.isArchived || (notice.expiryDate && new Date(notice.expiryDate) < new Date())
              ? `Expired ${format(new Date(notice.expiryDate!), "MMM d, yyyy")}`
              : format(new Date(notice.createdAt), "MMM d, yyyy")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick?.(notice.id)}
      className="bg-card border border-line rounded-[3px] py-4 px-3 cursor-pointer transition-all duration-300 relative hover:bg-card-hover hover:border-[#343332] "
    >
      <div className="flex justify-between items-start gap-4 mb-5">
        <h4 className="text-[1.05rem] font-medium text-[#D6D5D4] leading-snug">
          {notice.title}
        </h4>
        <div className="flex items-center gap-1 shrink-0">
          {onBookmark && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(notice.id);
              }}
              className={`bg-transparent border-none cursor-pointer text-xl p-1 transition-all hover:scale-115 ${isBookmarked ? "text-accent" : "text-muted hover:text-accent"}`}
              title={isBookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <FiBookmark
                style={{ fill: isBookmarked ? "currentColor" : "none" }}
              />
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-subtle leading-relaxed line-clamp-2 mb-3">
        {notice.description}
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[0.7rem] font-semibold uppercase tracking-wider ${urgencyBadge[notice.urgency]}`}
        >
          {notice.urgency}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[0.7rem] font-semibold uppercase tracking-wider bg-[#343332]/40 text-[#D6D5D4]">
          {notice.category}
        </span>
        {notice.fileUrl && (
          <span className="text-xs text-muted flex items-center gap-1">
            <FiPaperclip /> Attachment
          </span>
        )}
        <span className="text-xs text-muted flex items-center gap-1">
          <FiCalendar className="text-[0.7rem]" />
          {notice.isArchived || (notice.expiryDate && new Date(notice.expiryDate) < new Date())
            ? `Expired ${format(new Date(notice.expiryDate!), "MMM d, yyyy")}`
            : format(new Date(notice.createdAt), "MMM d, yyyy")}
        </span>
        <span className="text-xs text-muted">by {notice.author.name}</span>
      </div>
    </div>
  );
}
