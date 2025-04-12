import { prisma } from "@/lib/prisma";
import type { Role } from "../../../../generated/prisma/enums";

export const authRepository = {
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
    },

    async createUser(data: {
        name: string;
        email: string;
        password: string;
        role: Role;
        rollNo?: string;
        branch?: string;
        year?: string;
        isVerified?: boolean;
        tempPassword?: boolean;
    }) {
        return prisma.user.create({
            data: {
                ...data,
                email: data.email.toLowerCase(),
            },
        });
    },

    async findById(id: number) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                rollNo: true,
                branch: true,
                year: true,
                isVerified: true,
                tempPassword: true,
                createdAt: true,
            },
        });
    },
};
