import apiClient from "@/lib/api/client";
import { LoginRequest, RegisterRequest, User } from "@/types/auth";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

interface AuthResponse {
    token: string;
    refreshToken: string;
    user: User;
}

class AuthService {
    private static instance: AuthService;

    private tokenKey = "healtheco_token";
    private refreshTokenKey = "healtheco_refresh_token";
    private userKey = "healtheco_user";

    private constructor() {}

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    // ================= AUTH =================
    async login(
        credentials: LoginRequest,
    ): Promise<ApiResponse<AuthResponse>> {
        const res = await apiClient.post<ApiResponse<AuthResponse>>(
            "/api/v1/auth/login",
            credentials,
        );

        if (res.data.success && res.data.data) {
            this.setTokens(
                res.data.data.token,
                res.data.data.refreshToken,
            );
            this.setUser(res.data.data.user);
        }

        return res.data;
    }

    async register(
        data: RegisterRequest,
    ): Promise<ApiResponse<AuthResponse>> {
        const payload = {
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
            fullName: data.fullName,
            role: data.role,
            phoneNumber: data.phoneNumber || undefined,
            dateOfBirth: data.dateOfBirth || undefined,
            address: data.address || undefined,
            city: data.city || undefined,
        };

        const res = await apiClient.post<ApiResponse<AuthResponse>>(
            "/api/v1/auth/register",
            payload,
        );

        if (res.data.success && res.data.data) {
            this.setTokens(
                res.data.data.token,
                res.data.data.refreshToken,
            );
            this.setUser(res.data.data.user);
        }

        return res.data;
    }

    async logout(): Promise<void> {
        try {
            // backend có thì gọi, không có cũng kệ
            await apiClient.post("/api/v1/auth/logout");
        } catch {
            /* ignore */
        } finally {
            this.clearAuth();
        }
    }

    // ================= USER =================
    async fetchCurrentUser(): Promise<User | null> {
        const token = this.getToken();
        if (!token) return null;

        try {
            const res = await apiClient.get<ApiResponse<User>>(
                "/api/v1/auth/me",
            );

            if (res.data.success && res.data.data) {
                this.setUser(res.data.data);
                return res.data.data;
            }

            this.clearAuth();
            return null;
        } catch {
            this.clearAuth();
            return null;
        }
    }

    async updateProfile(
        data: Partial<User>,
    ): Promise<ApiResponse<User>> {
        const res = await apiClient.put<ApiResponse<User>>(
            "/api/v1/user/profile",
            data,
        );

        if (res.data.success && res.data.data) {
            this.setUser(res.data.data);
        }

        return res.data;
    }

    async changePassword(
        currentPassword: string,
        newPassword: string,
    ): Promise<ApiResponse<void>> {
        const res = await apiClient.post<ApiResponse<void>>(
            "/api/v1/auth/change-password",
            { currentPassword, newPassword },
        );

        return res.data;
    }

    // ================= ROLE =================
    hasRole(role: string): boolean {
        return this.getUser()?.role === role;
    }

    isAdmin(): boolean {
        const role = this.getUser()?.role;
        return !!role &&
            [
                "SystemAdmin",
                "ClinicAdmin",
                "Admin",
                "ADMIN",
                "SuperAdmin",
            ].includes(role);
    }

    isDoctor(): boolean {
        return this.getUser()?.role === "Doctor";
    }

    isPatient(): boolean {
        return this.getUser()?.role === "Patient";
    }

    isAuthenticated(): boolean {
        return !!this.getToken() && !!this.getUser();
    }

    // ================= STORAGE =================
    getUser(): User | null {
        if (typeof window === "undefined") return null;
        const raw = localStorage.getItem(this.userKey);
        return raw ? JSON.parse(raw) : null;
    }

    getToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(this.tokenKey);
    }

    private setTokens(token: string, refreshToken: string) {
        if (typeof window === "undefined") return;
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    private setUser(user: User) {
        if (typeof window === "undefined") return;
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    clearAuth() {
        if (typeof window === "undefined") return;
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userKey);
    }
}

export const authService = AuthService.getInstance();
