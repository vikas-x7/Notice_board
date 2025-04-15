import api from "@/lib/axios";
import type { User } from "@/client/notice/types/notice.types";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    rollNo: string;
    branch: string;
    year: string;
}

export const authService = {
    async login(payload: LoginPayload) {
        const { data } = await api.post<{ user: User; token: string }>("/auth/login", payload);
        return data;
    },

    async register(payload: RegisterPayload) {
        const { data } = await api.post<{ user: User; token: string }>("/auth/register", payload);
        return data;
    },

    async me() {
        const { data } = await api.get<{ user: User }>("/auth/me");
        return data;
    },

    async logout() {
        const { data } = await api.post("/auth/logout");
        return data;
    },
};
