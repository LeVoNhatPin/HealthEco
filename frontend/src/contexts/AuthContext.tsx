// frontend/src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { AuthResponse, User } from '@/types/auth';
import { ApiResponse } from '@/types/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'; // THÊM IMPORT

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<ApiResponse<AuthResponse>>;
    logout: () => Promise<void>;
    updateProfile: (data: any) => Promise<ApiResponse<User>>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<ApiResponse<void>>;
    refreshUser: () => Promise<void>;
    hasRole: (role: string) => boolean;
    isAdmin: () => boolean;
    isDoctor: () => boolean;
    isPatient: () => boolean;
    getRedirectPath: (user: User) => string; // THÊM METHOD MỚI
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter(); // THÊM HOOK ROUTER

    useEffect(() => {
        checkAuth();
    }, []);

    // ================= HELPER FUNCTION =================
    const getRedirectPath = (user: User): string => {
        switch (user.role) {
            case 'Patient':
                return '/bang-dieu-khien';
            case 'Doctor':
                return '/bac-si/bang-dieu-khien';
            case 'ClinicAdmin':
                return '/phong-kham/bang-dieu-khien';
            case 'SystemAdmin':
                return '/admin/bang-dieu-khien';
            default:
                return '/';
        }
    };

    const checkAuth = async () => {
        try {
            const cachedUser = authService.getUser();
            if (cachedUser) {
                setUser(cachedUser);
                return;
            }

            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    // ================= LOGIN (SỬA LẠI) =================
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.login({ email, password });

            if (response.success && response.data) {
                const userData = response.data.user;
                setUser(userData);
                toast.success(response.message || 'Đăng nhập thành công');

                // QUAN TRỌNG: THÊM LOGIC REDIRECT DỰA TRÊN ROLE
                const redirectPath = getRedirectPath(userData);
                router.push(redirectPath);

            } else {
                toast.error(response.message || 'Đăng nhập thất bại');
                throw new Error(response.message);
            }
        } catch (error: any) {
            toast.error(error?.message || 'Đăng nhập thất bại');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // ================= REGISTER =================
    const register = async (data: any) => {
        setIsLoading(true);
        try {
            const response = await authService.register(data);

            if (response.success && response.data) {
                const userData = response.data.user;
                setUser(userData);
                toast.success(response.message || 'Đăng ký thành công');

                // Redirect sau khi đăng ký
                const redirectPath = getRedirectPath(userData);
                router.push(redirectPath);

                return response;
            }

            toast.error(response.message || 'Đăng ký thất bại');
            throw new Error(response.message);
        } catch (error: any) {
            toast.error(error?.message || 'Đăng ký thất bại');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // ================= LOGOUT =================
    const logout = async () => {
        setIsLoading(true);
        try {
            await authService.logout();
            setUser(null);
            toast.success('Đăng xuất thành công');
            router.push('/dang-nhap'); // Redirect về trang login
        } catch (error: any) {
            toast.error('Đăng xuất thất bại');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // ================= UPDATE PROFILE =================
    const updateProfile = async (data: any): Promise<ApiResponse<User>> => {
        setIsLoading(true);
        try {
            const response = await authService.updateProfile(data);

            if (response.success && response.data) {
                setUser(response.data);
                toast.success(response.message || 'Cập nhật thông tin thành công');
            } else {
                toast.error(response.message || 'Cập nhật thất bại');
            }

            return response;
        } catch (error: any) {
            toast.error(error?.message || 'Cập nhật thông tin thất bại');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // ================= CHANGE PASSWORD =================
    const changePassword = async (
        currentPassword: string,
        newPassword: string
    ): Promise<ApiResponse<void>> => {
        setIsLoading(true);
        try {
            const response = await authService.changePassword(currentPassword, newPassword);

            if (response.success) {
                toast.success(response.message || 'Đổi mật khẩu thành công');
            } else {
                toast.error(response.message || 'Đổi mật khẩu thất bại');
            }

            return response;
        } catch (error: any) {
            toast.error(error?.message || 'Đổi mật khẩu thất bại');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // ================= REFRESH USER =================
    const refreshUser = async () => {
        try {
            const freshUser = await authService.refreshUser();
            if (freshUser) {
                setUser(freshUser);
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };





    // ================= ROLE HELPERS =================
    const hasRole = (role: string): boolean => {
        return user?.role === role;
    };


    const isAdmin = (): boolean => user?.role === 'SystemAdmin' || user?.role === 'ClinicAdmin';
    const isDoctor = (): boolean => hasRole('Doctor');
    const isPatient = (): boolean => hasRole('Patient');

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        refreshUser,
        hasRole,
        isAdmin,
        isDoctor,
        isPatient,
        getRedirectPath, // THÊM VÀO CONTEXT VALUE
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}