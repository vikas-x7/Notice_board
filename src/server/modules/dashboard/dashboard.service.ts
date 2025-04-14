import { dashboardRepository } from "./dashboard.repository";

export const dashboardService = {
    async getStats(userId: number, role: string) {
        if (role === "SUPER_ADMIN") {
            const stats = await dashboardRepository.getSuperAdminStats();
            return { role: "SUPER_ADMIN", stats };
        }

        if (role === "ADMIN") {
            const stats = await dashboardRepository.getAdminStats(userId);
            return { role: "ADMIN", stats };
        }

        const stats = await dashboardRepository.getStudentStats(userId);
        return { role: "STUDENT", stats };
    },
};
