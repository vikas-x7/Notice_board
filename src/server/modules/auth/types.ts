export interface TokenPayload {
    userId: number;
    email: string;
    role: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
    rollNo: string;
    branch: string;
    year: string;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
    department: string | null;
    rollNo: string | null;
    branch: string | null;
    year: string | null;
    isVerified: boolean;
    tempPassword: boolean;
    createdAt: Date;
}

export interface AuthResponse {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        department?: string | null;
        tempPassword?: boolean;
    };
    token: string;
}
