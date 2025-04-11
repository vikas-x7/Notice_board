import { asyncHandler } from "@/lib/asyncHandler";
import { subscriptionController } from "@/server/modules/subscription/subscription.controller";

export const GET = asyncHandler(subscriptionController.list);
export const POST = asyncHandler(subscriptionController.subscribe);
export const DELETE = asyncHandler(subscriptionController.unsubscribe);
