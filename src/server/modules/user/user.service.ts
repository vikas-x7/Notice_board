import { userRepository } from "./user.repository";
import { hashPassword } from "@/lib/password";
import { badRequestError, forbiddenError } from "@/lib/AppError";

export const userService = {
    async listAll() {
        const users = await userRepository.findAll();
        return { users };
    },

    async createAdmin(input: { name: string; email: string; department: string }) {
        if (!input.name || !input.email || !input.department) {
            throw badRequestError("Name, email, and department are required");
        }

        const existing = await userRepository.findByEmail(input.email);
        if (existing) throw badRequestError("Email already exists");

        const tempPassword = `Temp@${Math.random().toString(36).slice(-6).toUpperCase()}`;
        const hashedPwd = await hashPassword(tempPassword);

        const newAdmin = await userRepository.createAdmin({
            name: input.name,
            email: input.email,
            password: hashedPwd,
            department: input.department,
        });

        console.log(`Admin created: ${input.email} with temp password: ${tempPassword}`);

        return {
            admin: {
                id: newAdmin.id,
                name: newAdmin.name,
                email: newAdmin.email,
                department: newAdmin.department,
            },
            tempPassword,
        };
    },

    async deleteUser(userId: number) {
        if (isNaN(userId)) throw badRequestError("Invalid user ID");

        const targetUser = await userRepository.findById(userId);
        if (!targetUser) throw badRequestError("User not found");
        if (targetUser.role === "SUPER_ADMIN") throw forbiddenError("Cannot delete super admin");

        await userRepository.delete(userId);
        return { message: "User deleted successfully" };
    },
};
