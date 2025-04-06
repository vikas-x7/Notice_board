"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/client/home/Sidebar";
import NoticeCard from "@/client/home/NoticeCard";
import NoticeDetail from "@/client/home/NoticeDetail";
import toast from "react-hot-toast";
import Navbar from "@/client/home/Navbar";
import { FiBookmark, FiSearch, FiX } from "react-icons/fi";
import { BsPinAngleFill } from "react-icons/bs";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}
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
  author: { id: number; name: string; department?: string | null };
}

export default function StudentFeed() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [pinnedNotices, setPinnedNotices] = useState<Notice[]>([]);
  const [bookmarks, setBookmarks] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedLoading, setFeedLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeUrgency, setActiveUrgency] = useState("ALL");
  const [showBookmarksPopup, setShowBookmarksPopup] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const noticeRequestRef = useRef(0);
  const mainRef = useRef<HTMLElement>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {},
  );

  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  const fetchNotices = useCallback(async () => {
    const currentRequestId = ++noticeRequestRef.current;

    try {
      const p = new URLSearchParams();
      if (debouncedSearch) p.set("search", debouncedSearch);
      p.set("limit", "50");

      let url = "";
      if (activeCategory === "ARCHIVED") {
        url = `/api/v1/archive?${p.toString()}`;
      } else {
        if (activeCategory !== "ALL") p.set("category", activeCategory);
        if (activeUrgency !== "ALL") p.set("urgency", activeUrgency);
        p.set("includeCategoryCounts", "true");
        url = `/api/v1/notices?${p.toString()}`;
      }

      const res = await fetch(url, {
        cache: "no-store",
      });
      if (res.ok) {
        const d = await res.json();
        if (currentRequestId === noticeRequestRef.current) {
          setNotices(activeCategory === "ARCHIVED" ? d.notices : d.notices.filter((n: Notice) => debouncedSearch ? true : !n.isPinned));
          if (activeCategory !== "ARCHIVED") {
            setCategoryCounts(d.categoryCounts ?? {});
          }
        }
      } else if (currentRequestId === noticeRequestRef.current) {
        setNotices([]);
        if (activeCategory !== "ARCHIVED") setCategoryCounts({});
      }
    } catch {
      console.error("Failed to fetch notices");
      if (currentRequestId === noticeRequestRef.current) {
        setNotices([]);
        if (activeCategory !== "ARCHIVED") setCategoryCounts({});
      }
    } finally {
      if (currentRequestId === noticeRequestRef.current) {
        setFeedLoading(false);
      }
    }
  }, [activeCategory, activeUrgency, debouncedSearch]);

  const fetchAll = useCallback(async () => {
    try {
      const [meRes, pinnedRes, bmRes, subsRes] = await Promise.all([
        fetch("/api/v1/auth/me", { cache: "no-store" }),
        fetch("/api/v1/pinned", { cache: "no-store" }),
        fetch("/api/v1/bookmarks", { cache: "no-store" }),
        fetch("/api/v1/subscriptions", { cache: "no-store" }),
      ]);
      if (!meRes.ok) {
        router.push("/login");
        return;
      }
      const meData = await meRes.json();
      if (meData.user.role !== "STUDENT") {
        router.push("/admin/dashboard");
        return;
      }
      setUser(meData.user);
      if (pinnedRes.ok) {
        const d = await pinnedRes.json();
        setPinnedNotices(d.notices);
      }
      if (bmRes.ok) {
        const d = await bmRes.json();
        const bookmarkedNotices = d.bookmarks.map(
          (b: { notice: Notice }) => b.notice,
        );
        setBookmarks(bookmarkedNotices);
        setBookmarkedIds(
          new Set(bookmarkedNotices.map((notice: Notice) => notice.id)),
        );
      }
      if (subsRes.ok) {
        const d = await subsRes.json();
        setSubscriptions(
          d.subscriptions.map((s: { category: string }) => s.category),
        );
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!user) return;

    setFeedLoading(true);
  }, [user, activeCategory, activeUrgency, debouncedSearch]);

  useEffect(() => {
    if (user) {
      void fetchNotices();
      mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [user, fetchNotices]);

  const handleBookmark = async (noticeId: number) => {
    const isCurrentlyBookmarked = bookmarkedIds.has(noticeId);

    // Optimistic Update
    if (isCurrentlyBookmarked) {
      setBookmarkedIds((prev) => {
        const n = new Set(prev);
        n.delete(noticeId);
        return n;
      });
      setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== noticeId));
    } else {
      const bookmarkNotice =
        selectedNotice?.id === noticeId
          ? selectedNotice
          : (notices.find((notice) => notice.id === noticeId) ??
            pinnedNotices.find((notice) => notice.id === noticeId));

      setBookmarkedIds((prev) => new Set(prev).add(noticeId));
      if (bookmarkNotice) {
        setBookmarks((prev) =>
          prev.some((bookmark) => bookmark.id === noticeId) ? prev : [bookmarkNotice, ...prev]
        );
      }
    }

    try {
      if (isCurrentlyBookmarked) {
        const res = await fetch(`/api/v1/bookmarks?noticeId=${noticeId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error();
        toast.success("Removed");
      } else {
        const res = await fetch("/api/v1/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ noticeId }),
        });
        if (!res.ok) throw new Error();
        toast.success("Bookmarked!");
      }
    } catch {
      toast.error("Failed");
      // Revert optimistic update
      if (isCurrentlyBookmarked) {
        setBookmarkedIds((prev) => new Set(prev).add(noticeId));
      } else {
        setBookmarkedIds((prev) => {
          const n = new Set(prev);
          n.delete(noticeId);
          return n;
        });
        setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== noticeId));
      }
    }
  };

  const handleSubscriptionToggle = async (category: string) => {
    const isCurrentlySubscribed = subscriptions.includes(category);

    // Optimistic Update
    if (isCurrentlySubscribed) {
      setSubscriptions((prev) => prev.filter((c) => c !== category));
    } else {
      setSubscriptions((prev) => [...prev, category]);
    }

    try {
      if (isCurrentlySubscribed) {
        const res = await fetch(`/api/v1/subscriptions?category=${category}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error();
        toast.success(`Unsubscribed from ${category}`);
      } else {
        const res = await fetch("/api/v1/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category }),
        });
        if (!res.ok) throw new Error();
        toast.success(`Subscribed to ${category}!`);
      }
    } catch {
      toast.error("Failed");
      // Revert on failure
      if (isCurrentlySubscribed) {
        setSubscriptions((prev) => [...prev, category]);
      } else {
        setSubscriptions((prev) => prev.filter((c) => c !== category));
      }
    }
  };

  const handleNoticeClick = async (noticeId: number) => {
    const localNotice =
      notices.find((n) => n.id === noticeId) ||
      pinnedNotices.find((n) => n.id === noticeId) ||
      bookmarks.find((n) => n.id === noticeId);

    if (localNotice) {
      setSelectedNotice(localNotice);
    }

    try {
      const res = await fetch(`/api/v1/notices/${noticeId}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const d = await res.json();
        setSelectedNotice(d.notice);
      }
    } catch {
      if (!localNotice) {
        toast.error("Failed to load notice");
      }
    }
  };

  const handlePinnedNoticeClick = (noticeId: number) => {
    void handleNoticeClick(noticeId);
  };

  const handleBookmarkPopupNoticeClick = (noticeId: number) => {
    setShowBookmarksPopup(false);
    void handleNoticeClick(noticeId);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-line border-t-primary rounded-full animate-spin-slow" />
      </div>
    );
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#171615] md:h-screen md:overflow-hidden">
      <div className="flex md:h-full md:min-h-0 max-md:flex-col">
        <Sidebar
          user={user}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          categoryCounts={categoryCounts}
          subscriptions={subscriptions}
          showSubscriptions={true}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main ref={mainRef} className="flex-1 min-w-0 md:min-h-0 md:overflow-y-auto">
          <div className="sticky top-0 z-40">
            <Navbar
              user={user}
              showUserInfo={false}
              title={
                (activeCategory === "ARCHIVED"
                  ? "Archived Notices"
                  : activeCategory !== "ALL"
                    ? `${activeCategory} Notices`
                    : "All Notices") +
                (activeUrgency !== "ALL" && activeCategory !== "ARCHIVED" ? ` • ${activeUrgency}` : "") +
                (debouncedSearch ? ` • "${debouncedSearch}"` : "")
              }
              search={search}
              onSearchChange={setSearch}
              activeUrgency={activeUrgency}
              onUrgencyChange={setActiveUrgency}
              bookmarkedCount={bookmarks.length}
              onBookmarksClick={() => setShowBookmarksPopup(true)}
              isSubscribed={subscriptions.includes(activeCategory)}
              onSubscribe={
                activeCategory !== "ALL" && activeCategory !== "ARCHIVED"
                  ? () => handleSubscriptionToggle(activeCategory)
                  : undefined
              }
              onMenuClick={() => setIsSidebarOpen(true)}
            />
          </div>

          <div className="p-6 max-md:p-4">
            {activeCategory !== "ARCHIVED" && !debouncedSearch && pinnedNotices.length > 0 && (
              <section className="mb-6 rounded-2xl">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="mt-2 flex items-center gap-2 text-2xl font-semibold text-[#D6D5D4]">
                      <BsPinAngleFill />
                      Pinned Notices
                    </h2>
                    <p className="mt-1 text-sm text-subtle">
                      Important pinned notices will now always remain visible at the top of the feed.
                    </p>
                  </div>
                  <div className="rounded-full  px-3 py-1 text-xs font-semibold uppercase tracking-wider text-warning">
                    {pinnedNotices.length} pinned
                  </div>
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 border-b pb-4 border-[#3a3a39]">
                  {pinnedNotices.map((notice) => (
                    <NoticeCard
                      key={notice.id}
                      notice={notice}
                      variant="pinned"
                      isBookmarked={bookmarkedIds.has(notice.id)}
                      onBookmark={handleBookmark}
                      onClick={handlePinnedNoticeClick}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Feed */}
            <section className="flex min-h-[calc(100vh-8.5rem)] flex-col ">
              {feedLoading ? (
                <div className="flex flex-1 items-center justify-center px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-10 w-10 rounded-full border-2 border-line border-t-white animate-spin-slow" />
                    <h3 className="mt-4 text-lg font-semibold text-white">
                      Loading notices
                    </h3>
                    <p className="mt-2 text-sm text-white">
                      Fetching the latest notices for this feed.
                    </p>
                  </div>
                </div>
              ) : notices.length === 0 ? (
                <div className="flex flex-1 items-center justify-center px-6 py-12 text-center text-muted">
                  <div className="flex flex-col items-center justify-center">
                    <FiSearch className="text-5xl text-subtle opacity-60" />
                    <h3 className="mt-4 text-lg font-semibold text-subtle">
                      No notices found
                    </h3>
                    <p className="mt-2 text-sm">Try changing your filters.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                  {notices.map((n) => (
                    <NoticeCard
                      key={n.id}
                      notice={n}
                      isBookmarked={bookmarkedIds.has(n.id)}
                      onBookmark={handleBookmark}
                      onClick={handleNoticeClick}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {selectedNotice && (
        <NoticeDetail
          notice={selectedNotice}
          isBookmarked={bookmarkedIds.has(selectedNotice.id)}
          onBookmark={handleBookmark}
          onClose={() => setSelectedNotice(null)}
        />
      )}

      {showBookmarksPopup && (
        <div
          className="fixed inset-0 z-[180] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
          onClick={() => setShowBookmarksPopup(false)}
        >
          <div
            className="w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-2xl border border-line bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.25em] text-warning">
                  Notifications
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Bookmarked Notices
                </h2>
                <p className="mt-1 text-sm text-subtle">
                  Your saved notices are collected here for quick access.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBookmarksPopup(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-subtle transition-all hover:bg-card-hover hover:text-white"
                title="Close bookmarks"
              >
                <FiX />
              </button>
            </div>

            {bookmarks.length === 0 ? (
              <div className="rounded-xl border border-line bg-surface px-6 py-12 text-center">
                <FiBookmark className="mx-auto text-4xl text-subtle opacity-60" />
                <h3 className="mt-4 text-lg font-semibold text-white">
                  No bookmarks yet
                </h3>
                <p className="mt-2 text-sm text-muted">
                  Save any notice and it will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                {bookmarks.map((notice) => (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    isBookmarked
                    onBookmark={handleBookmark}
                    onClick={handleBookmarkPopupNoticeClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
