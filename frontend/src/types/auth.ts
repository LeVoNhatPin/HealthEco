export interface User {
    id: number;
    email: string;
    fullName: string;
    role: string;
    phoneNumber: string;
    avatarUrl?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    isActive: boolean;
    isEmailVerified: boolean;
    themePreference?: string;
    languagePreference?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    role?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: User;
}

// THÊM INTERFACE CHO PROFILE UPDATE
export interface UpdateProfileRequest {
    fullName?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    avatarUrl?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}