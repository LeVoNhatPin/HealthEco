'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { AuthResponse, User } from '@/types/auth';
import { ApiResponse } from '@/types/api';
import { toast } from 'sonner';

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

    useEffect(() => {
        checkAuth();
    }, []);

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

    // ================= LOGIN =================
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.login({ email, password });

            if (response.success && response.data) {
                setUser(response.data.user);
                toast.success(response.message || 'Đăng nhập thành công');
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
                setUser(response.data.user);
                toast.success(response.message || 'Đăng ký thành công');
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
    const hasRole = (role: string): boolean => authService.hasRole(role);
    const isAdmin = (): boolean => authService.isAdmin();
    const isDoctor = (): boolean => authService.isDoctor();
    const isPatient = (): boolean => authService.isPatient();

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
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
