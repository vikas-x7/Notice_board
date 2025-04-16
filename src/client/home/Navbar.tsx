"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiBookmark,
  FiSearch,
  FiChevronDown,
  FiBell,
  FiMenu,
  FiLogOut,
} from "react-icons/fi";
import toast from "react-hot-toast";
import NotificationsMenu from "./NotificationsMenu";

const URGENCY_LEVELS = [
  { key: "ALL", label: "All", dot: "", active: "" },
  { key: "URGENT", label: "Urgent", dot: "bg-danger", active: "text-danger" },
  {
    key: "IMPORTANT",
    label: "Important",
    dot: "bg-warning",
    active: "text-warning",
  },
  { key: "NORMAL", label: "Normal", dot: "bg-info", active: "text-info" },
];

interface NavbarProps {
  user: { name: string; role: string; email: string };
  showUserInfo?: boolean;
  title?: string;
  search?: string;
  onSearchChange?: (v: string) => void;
  activeUrgency?: string;
  onUrgencyChange?: (v: string) => void;
  bookmarkedCount?: number;
  onBookmarksClick?: () => void;
  isSubscribed?: boolean;
  onSubscribe?: () => void;
  onMenuClick?: () => void;
}

export default function Navbar({
  user,
  showUserInfo = true,
  title = "",
  search = "",
  onSearchChange,
  activeUrgency = "ALL",
  onUrgencyChange,
  bookmarkedCount = 0,
  onBookmarksClick,
  isSubscribed,
  onSubscribe,
  onMenuClick,
}: NavbarProps) {
  const [urgencyOpen, setUrgencyOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const urgencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        urgencyRef.current &&
        !urgencyRef.current.contains(e.target as Node)
      ) {
        setUrgencyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeLevel = URGENCY_LEVELS.find((u) => u.key === activeUrgency);

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      setShowLogoutConfirm(false);
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const roleDisplay = user.role.replace("_", " ");

  return (
    <>
      <nav className="z-50 bg-[#171615] min-h-[64px] sm:h-16 px-4 py-3 sm:py-0 flex flex-col sm:flex-row items-start sm:items-center justify-center sm:justify-between sticky top-0 w-full border-b border-[#343332]/50 gap-3 sm:gap-0 transition-all">
        <div className="flex items-center w-full sm:w-auto gap-3 shrink min-w-0">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="md:hidden flex h-9 w-9 sm:h-9 sm:w-9 items-center justify-center rounded-[4px] text-white hover:bg-white/10 transition-all -ml-2 shrink-0"
              title="Open Menu"
            >
              <FiMenu size={20} />
            </button>
          )}
          {title && (
            <h1 className="text-xl sm:text-[22px] uppercase text-[#D6D5D4] font-serif truncate w-full sm:max-w-xs ">
              {title}
            </h1>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0 justify-start sm:justify-end">
          {onSearchChange && (
            <div className="relative shrink-0 w-full min-[450px]:w-auto">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted max-sm:text-sm" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full min-[450px]:w-[180px] sm:w-[240px] md:w-[320px] h-9 pl-9 pr-3.5 bg-[#1D1C1B] border border-[#373635] rounded-[4px] text-white text-sm outline-none transition-all placeholder:text-muted/70"
              />
            </div>
          )}
          {onUrgencyChange && (
            <div className="relative" ref={urgencyRef}>
              <button
                type="button"
                onClick={() => setUrgencyOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-2.5 h-9 rounded-[4px] text-xs font-medium border transition-all cursor-pointer shrink-0 ${activeUrgency !== "ALL" && activeLevel?.active
                  ? `border-white/20 ${activeLevel.active}`
                  : "border-white/20 text-subtle"
                  } bg-[#171615] hover:bg-white/5`}
              >
                {activeLevel?.dot && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeLevel.dot}`}
                  />
                )}
                <span className="hidden sm:inline">
                  {activeUrgency === "ALL" ? "Urgency" : activeLevel?.label}
                </span>
                <span className="sm:hidden text-xs">
                  {activeUrgency === "ALL" ? "All" : activeLevel?.label.slice(0, 3)}
                </span>
                <FiChevronDown
                  className={`transition-transform max-sm:text-[10px] ${urgencyOpen ? "rotate-180" : ""}`}
                />
              </button>
              {urgencyOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-40 bg-[#1D1C1B] border border-[#343332] rounded-[3px] shadow-[0_8px_24px_rgba(0,0,0,0.4)] py-1 z-50">
                  {URGENCY_LEVELS.map((u) => (
                    <button
                      key={u.key}
                      onClick={() => {
                        onUrgencyChange(u.key);
                        setUrgencyOpen(false);
                      }}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-left transition-all cursor-pointer ${activeUrgency === u.key
                        ? "bg-[#232222] text-white"
                        : "text-[#A8A7A6] hover:bg-[#232222] hover:text-white"
                        }`}
                    >
                      {u.dot && (
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${u.dot}`}
                        />
                      )}
                      {u.label}
                      {activeUrgency === u.key && (
                        <span className="ml-auto text-[10px]">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {onSubscribe && (
            <button
              onClick={onSubscribe}
              className={`flex items-center gap-1.5 px-2.5 h-9 rounded-[4px] text-xs font-medium border transition-all cursor-pointer shrink-0 ${isSubscribed
                ? "border-primary bg-primary/10 text-white hover:bg-primary/20"
                : "border-white/20 bg-[#171615] text-white hover:bg-white/5 hover:text-white"
                }`}
              title={isSubscribed ? "Unsubscribe from this category" : "Subscribe to this category"}
            >
              <FiBell
                className="text-[14px]"
                style={{ fill: isSubscribed ? "currentColor" : "none" }}
              />
              <span className="inline">
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </span>
            </button>
          )}

          <NotificationsMenu />

          {onBookmarksClick && (
            <button
              type="button"
              onClick={onBookmarksClick}
              disabled={bookmarkedCount === 0}
              className="relative w-9 h-9 shrink-0 bg-[#171615] border border-white/20 text-white rounded-[4px] cursor-pointer flex items-center justify-center text-sm hover:bg-white/10 transition-all disabled:cursor-not-allowed disabled:opacity-50"
              title="Bookmarked notices"
            >
              <FiBookmark />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#171615] text-[0.65rem] font-bold flex items-center justify-center">
                  {bookmarkedCount}
                </span>
              )}
            </button>
          )}

          {showUserInfo && (
            <div className="flex items-center gap-1 sm:gap-2.5 ml-0 sm:ml-2">
              <div className="flex items-center gap-2 sm:gap-2.5 py-1.5 pl-1 sm:pl-2 pr-1 sm:pr-3.5">
                <div className="w-[26px] h-[26px] sm:w-[30px] sm:h-[30px] rounded-full bg-white/25 flex items-center justify-center font-semibold text-[10px] sm:text-xs text-white shrink-0">
                  {initials}
                </div>
                <div className="hidden sm:flex flex-col leading-tight">
                  <span className="text-xs font-semibold text-white">
                    {user.name}
                  </span>
                  <span className="text-[0.65rem] opacity-75 uppercase tracking-wider text-white">
                    {roleDisplay}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex h-9 w-9 items-center justify-center rounded-[3px] bg-danger/15 text-danger transition-all hover:bg-danger/25"
                title="Logout"
              >
                <FiLogOut />
              </button>
            </div>
          )}
        </div>
      </nav>

      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => !isLoggingOut && setShowLogoutConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-[3px] border border-[#343332]/80 bg-[#1D1C1B] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-white">Log out?</h2>
            <p className="mt-2 text-sm leading-relaxed text-subtle">
              Are you sure you want to log out? You can press Cancel to stay
              signed in.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="flex-1 rounded-lg border border-[#343332]/80 bg-transparent px-4 py-2.5 text-sm font-semibold text-subtle transition-all hover:bg-[#232222] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                disabled={isLoggingOut}
                className="flex-1 rounded-lg border border-danger/30 bg-danger/15 px-4 py-2.5 text-sm font-semibold text-danger transition-all hover:bg-danger/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingOut ? "Logging out..." : "Log out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
