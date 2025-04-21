import { NextRequest, NextResponse } from "next/server";
import { AppError } from "./AppError";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HandlerFn = (request: NextRequest, context?: any) => Promise<NextResponse>;

export function asyncHandler(fn: HandlerFn): HandlerFn {
    return async (request, context) => {
        try {
            return await fn(request, context);
        } catch (error) {
            if (error instanceof AppError) {
                return NextResponse.json(
                    { error: error.message },
                    { status: error.statusCode }
                );
            }
            console.error("Unhandled error:", error);
            return NextResponse.json(
                { error: "Something went wrong" },
                { status: 500 }
            );
        }
    };
}
