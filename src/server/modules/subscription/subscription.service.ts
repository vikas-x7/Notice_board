import { subscriptionRepository } from "./subscription.repository";
import { badRequestError } from "@/lib/AppError";

export const subscriptionService = {
    async list(userId: number) {
        const subscriptions = await subscriptionRepository.findByUser(userId);
        return { subscriptions };
    },

    async subscribe(userId: number, category: string) {
        if (!category) throw badRequestError("Category is required");

        const existing = await subscriptionRepository.findUnique(userId, category);
        if (existing) throw badRequestError("Already subscribed to this category");

        const subscription = await subscriptionRepository.create(userId, category);
        return { subscription };
    },

    async unsubscribe(userId: number, category: string) {
        if (!category) throw badRequestError("Category is required");
        await subscriptionRepository.deleteByCategory(userId, category);
        return { message: "Unsubscribed successfully" };
    },
};
