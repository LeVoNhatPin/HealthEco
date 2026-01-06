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

    async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
        try {
            const response = await apiClient.post<ApiResponse<AuthResponse>>(
                "/api/v1/auth/login",
                credentials
            );

            if (response.data.success && response.data.data) {
                this.setTokens(
                    response.data.data.token,
                    response.data.data.refreshToken
                );
                this.setUser(response.data.data.user);
            }

            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data || {
                    success: false,
                    message: "Đã có lỗi xảy ra",
                }
            );
        }
    }

    async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
        try {
            const response = await apiClient.post<ApiResponse<AuthResponse>>(
                "/api/v1/auth/register",
                data
            );

            if (response.data.success && response.data.data) {
                this.setTokens(
                    response.data.data.token,
                    response.data.data.refreshToken
                );
                this.setUser(response.data.data.user);
            }

            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data || {
                    success: false,
                    message: "Đã có lỗi xảy ra",
                }
            );
        }
    }

    async logout(): Promise<void> {
        try {
            await apiClient.post("/api/v1/auth/logout");
        } finally {
            this.clearAuth();
        }
    }

    async getCurrentUser(): Promise<User | null> {
        const token = this.getToken();
        if (!token) return null; // ⬅️ chặn gọi API khi chưa login

        const user = this.getUser();
        if (user) return user;

        try {
            const response = await apiClient.get<ApiResponse<User>>(
                "/api/v1/auth/me"
            );
            if (response.data.success && response.data.data) {
                this.setUser(response.data.data);
                return response.data.data;
            }
            return null;
        } catch {
            return null;
        }
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getUser(): User | null {
        if (typeof window !== "undefined") {
            const userStr = localStorage.getItem(this.userKey);
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    }

    getToken(): string | null {
        if (typeof window !== "undefined") {
            return localStorage.getItem(this.tokenKey);
        }
        return null;
    }

    setTokens(token: string, refreshToken: string): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(this.tokenKey, token);
            localStorage.setItem(this.refreshTokenKey, refreshToken);
        }
    }

    setUser(user: User): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(this.userKey, JSON.stringify(user));
        }
    }

    clearAuth(): void {
        if (typeof window !== "undefined") {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.refreshTokenKey);
            localStorage.removeItem(this.userKey);
        }
    }
}

export const authService = AuthService.getInstance();
