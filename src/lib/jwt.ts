import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "college-notice-board-secret-key-2026";

interface TokenPayload {
    userId: number;
    email: string;
    role: string;
}

export function signToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
        return null;
    }
}
