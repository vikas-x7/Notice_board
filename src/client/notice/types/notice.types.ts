export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    department?: string | null;
    rollNo?: string | null;
    branch?: string | null;
    year?: string | null;
    isVerified?: boolean;
    tempPassword?: boolean;
    createdAt?: string;
}

export interface Notice {
    id: number;
    title: string;
    description: string;
    category: string;
    urgency: string;
    isPinned: boolean;
    isArchived: boolean;
    fileUrl?: string | null;
    fileName?: string | null;
    fileType?: "image" | "pdf" | null;
    createdAt: string;
    expiryDate?: string | null;
    author: {
        id: number;
        name: string;
        department?: string | null;
    };
    isBookmarked?: boolean;
}


export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface NoticeFilters {
    category?: string;
    urgency?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface Bookmark {
    id: number;
    notice: Notice;
}

export interface Subscription {
    id: number;
    category: string;
}

export interface DashboardStats {
    myNotices?: number;
    activeNotices?: number;
    pinnedNotices?: number;
    totalNotices?: number;
    totalAdmins?: number;
    totalStudents?: number;
    archivedNotices?: number;
    bookmarkCount?: number;
    subscriptionCount?: number;
    categoryStats?: Array<{ category: string; count: number }>;
}
