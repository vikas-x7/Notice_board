"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiBook,
  FiBriefcase,
  FiGift,
  FiAward,
  FiActivity,
  FiHome,
  FiLogOut,
  FiVolume2,
  FiArchive,
  FiX,
} from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import toast from "react-hot-toast";

const CATEGORIES = [
  {
    key: "ALL",
    label: "All Notices",
    icon: <FiVolume2 />,
  },
  {
    key: "ACADEMIC",
    label: "Academic",
    icon: <FiBook />,
  },
  {
    key: "PLACEMENT",
    label: "Placement",
    icon: <FiBriefcase />,
  },
  {
    key: "EVENTS",
    label: "Events",
    icon: <FiGift />,
  },
  {
    key: "SCHOLARSHIPS",
    label: "Scholarships",
    icon: <FiAward />,
  },
  {
    key: "SPORTS",
    label: "Sports",
    icon: <FiActivity />,
  },
  {
    key: "HOSTEL",
    label: "Hostel",
    icon: <FiHome />,
  },
  {
    key: "GENERAL",
    label: "General",
    icon: <FiVolume2 />,
  },
];

interface SidebarProps {
  user: { name: string; role: string; email: string };
  activeCategory: string;
  onCategoryChange: (v: string) => void;
  categoryCounts?: Record<string, number>;
  subscriptions?: string[];
  showSubscriptions?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  user,
  activeCategory,
  onCategoryChange,
  categoryCounts = {},
  subscriptions = [],
  showSubscriptions = false,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials = user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const roleDisplay = user.role.replace("_", " ");

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

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/90 md:hidden backdrop-blur-[50px] transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`w-[220px] shrink-0 bg-[#1D1C1B] text-primary-light flex flex-col border-r border-[#343332] md:sticky md:top-0 md:self-start md:h-screen max-md:fixed max-md:top-0 max-md:bottom-0 max-md:left-0 max-md:z-50 max-md:h-[100dvh] max-md:transition-transform max-md:duration-300 ${isOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}`}>
        <div className="shrink-0 z-10 bg-[#1D1C1B]">
          <div className="flex items-center justify-between px-2 py-[15px] border-b border-[#343332]">
            <div className="flex items-center gap-2">
              <h1>
                <MdDashboard size={23} />
              </h1>
              <h1 className="font-serif text-[22px]">Notice Board</h1>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden flex h-8 w-8 items-center justify-center rounded-[3px] text-primary-light hover:bg-[#232222] hover:text-white transition-all"
                title="Close Menu"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto sidebar-scrollbar py-5 flex flex-col gap-5">
          {/* Categories */}
          <div className="max-md:min-w-[200px] px-2">
            <h3 className="text-[0.7rem] uppercase tracking-widest text-primary-light mb-3 px-2">
              Categories
            </h3>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    onCategoryChange(cat.key);
                    onClose?.();
                  }}
                  className={`flex items-center gap-2.5  rounded-[3px] text-sm font-medium w-full text-left transition-all cursor-pointer px-1
                  ${activeCategory === cat.key ? "bg-[#232222] text-primary-light" : "bg-transparent border-transparent text-primary-light hover:bg-[#232222] hover:text-primary-light"}`}
                >
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0`}
                  >
                    {cat.icon}
                  </span>
                  <span>{cat.label}</span>
                  {cat.key !== "ALL" && (categoryCounts[cat.key] ?? 0) > 0 && (
                    <span className="ml-auto rounded-[3px] bg-[#1D1C1B] px-2 py-0.5 text-[0.7rem] font-semibold text-primary-light">
                      {categoryCounts[cat.key]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="max-md:min-w-[200px] px-2 mt-2 border-t border-[#343332]/50 pt-3">
            <button
              onClick={() => {
                onCategoryChange("ARCHIVED");
                onClose?.();
              }}
              className={`flex items-center gap-2.5 rounded-[3px] text-sm font-medium w-full text-left transition-all cursor-pointer px-1 
              ${activeCategory === "ARCHIVED" ? "bg-[#232222] text-primary-light" : "bg-transparent border-transparent text-primary-light hover:bg-[#232222] hover:text-primary-light"}`}
            >
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0">
                <FiArchive />
              </span>
              <span>Archived Notices</span>
            </button>
          </div>

          {showSubscriptions && (
            <div className="max-md:min-w-[200px] px-2">
              <h3 className="text-[0.7rem] uppercase tracking-widest text-primary-light mb-3 px-2">
                Subscriptions
              </h3>
              <div className="flex flex-col ">
                {CATEGORIES.filter(
                  (c) => c.key !== "ALL" && subscriptions.includes(c.key),
                ).length === 0 ? (
                  <p className="text-xs text-muted px-2">No subscriptions yet</p>
                ) : (
                  CATEGORIES.filter(
                    (c) => c.key !== "ALL" && subscriptions.includes(c.key),
                  ).map((cat) => (
                    <div
                      key={cat.key}
                      className="flex items-center gap-2.5 rounded-[3px] text-sm font-medium px-1 py-0.5 text-primary-light"
                    >
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0">
                        {cat.icon}
                      </span>
                      <span>{cat.label}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
        <div className="shrink-0 mt-auto border-t border-[#343332]/80 bg-[#1D1C1B]">
          <div className="flex items-center gap-3 rounded-lg  px-2 p-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-[3px] bg-white/15 text-sm  text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-primary-light">{user.name}</p>
              <p className="truncate text-[10px] uppercase tracking-wider text-primary-light">
                {roleDisplay}
              </p>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[3px]  bg-danger/15 text-danger transition-all hover:bg-danger/20"
              title="Logout"
            >
              <FiLogOut />
            </button>
          </div>
        </div>
      </aside>

      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#171615]/10 p-4 backdrop-blur-[10px]"
          onClick={() => !isLoggingOut && setShowLogoutConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-[3px] bg-[#1D1C1B] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[25px] font-serif text-white">Log out?</h2>

              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="rounded-[5px] px-2 py-1 text-[20px] cursor-pointer text-primary-light hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-primary-light">
              Are you sure you want to log out? You can press Cancel to stay
              signed in.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={confirmLogout}
                disabled={isLoggingOut}
                className="flex-1 rounded-[5px] border bg-[#D6D5D4] px-4 py-2 text-sm font-medium text-[#171615] cursor-pointer"
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
