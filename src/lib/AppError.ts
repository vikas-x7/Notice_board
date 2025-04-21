export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const badRequestError = (message: string) => new AppError(message, 400);
export const unauthorizedError = (message = "Unauthorized") => new AppError(message, 401);
export const forbiddenError = (message = "Forbidden") => new AppError(message, 403);
export const notFoundError = (message = "Not found") => new AppError(message, 404);
