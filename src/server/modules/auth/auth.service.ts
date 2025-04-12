import { authRepository } from "./auth.repository";
import { hashPassword, comparePassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";
import { badRequestError } from "@/lib/AppError";
import type { LoginInput, RegisterInput } from "./auth.validation";
import type { Role } from "../../../../generated/prisma/enums";

export const authService = {
    async login(input: LoginInput) {
        const user = await authRepository.findByEmail(input.email);
        if (!user) throw badRequestError("Invalid email or password");

        const isValid = await comparePassword(input.password, user.password);
        if (!isValid) throw badRequestError("Invalid email or password");

        const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                tempPassword: user.tempPassword,
            },
            token,
        };
    },

    async register(input: RegisterInput) {
        const existing = await authRepository.findByEmail(input.email);
        if (existing) throw badRequestError("Email already registered");

        const hashedPwd = await hashPassword(input.password);

        const user = await authRepository.createUser({
            name: input.name,
            email: input.email,
            password: hashedPwd,
            role: "STUDENT" as Role,
            rollNo: input.rollNo,
            branch: input.branch,
            year: input.year,
            isVerified: true,
        });

        const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        };
    },
};
