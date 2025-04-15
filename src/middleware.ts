import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a new ratelimiter, that allows 30 requests per 10 seconds per IP
const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(30, "10 s"),
    analytics: true,
});

export async function middleware(request: NextRequest) {
    // Extract identifier (IP address)
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

    // Apply rate limiting
    const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`);

    if (!success) {
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            {
                status: 429,
                headers: {
                    "X-RateLimit-Limit": limit.toString(),
                    "X-RateLimit-Remaining": remaining.toString(),
                    "X-RateLimit-Reset": reset.toString(),
                },
            }
        );
    }

    // Set standard rate limit headers on successful request path
    const res = NextResponse.next();
    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());

    return res;
}

// Applies rate limiting only to API routes
export const config = {
    matcher: [
        "/api/:path*",
    ],
};
