import { prisma } from "@/lib/prisma";

export const userRepository = {
    async findAll() {
        return prisma.user.findMany({
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
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });
    },

    async findById(id: number) {
        return prisma.user.findUnique({ where: { id } });
    },

    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    },

    async createAdmin(data: { name: string; email: string; password: string; department: string }) {
        return prisma.user.create({
            data: {
                name: data.name,
                email: data.email.toLowerCase(),
                password: data.password,
                role: "ADMIN",
                department: data.department,
                isVerified: true,
                tempPassword: true,
            },
        });
    },

    async delete(id: number) {
        return prisma.user.delete({ where: { id } });
    },
};
