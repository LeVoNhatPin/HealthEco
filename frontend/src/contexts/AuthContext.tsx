'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { AuthResponse, User } from '@/types/auth';
import { ApiResponse } from '@/types/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<ApiResponse<AuthResponse>>;
    logout: () => Promise<void>;
    // THÊM CÁC METHOD MỚI:
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


    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.login({ email, password });
            if (response.success && response.data) {
                setUser(response.data.user);
            } else {
                throw new Error(response.message || 'Đăng nhập thất bại');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: any) => {
        setIsLoading(true);
        try {
            const response = await authService.register(data);

            if (response.success && response.data) {
                setUser(response.data.user);
                return response;
            } else {
                throw new Error(response.message || 'Đăng ký thất bại');
            }
        } catch (error: any) {
            console.error('AuthContext register error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await authService.logout();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    // THÊM CÁC METHOD MỚI:

    const updateProfile = async (data: any): Promise<ApiResponse<User>> => {
        setIsLoading(true);
        try {
            const response = await authService.updateProfile(data);
            if (response.success && response.data) {
                setUser(response.data);
            }
            return response;
        } catch (error: any) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const changePassword = async (currentPassword: string, newPassword: string): Promise<ApiResponse<void>> => {
        setIsLoading(true);
        try {
            const response = await authService.changePassword(currentPassword, newPassword);
            return response;
        } catch (error: any) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

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

    const hasRole = (role: string): boolean => {
        return authService.hasRole(role);
    };

    const isAdmin = (): boolean => {
        return authService.isAdmin();
    };

    const isDoctor = (): boolean => {
        return authService.isDoctor();
    };

    const isPatient = (): boolean => {
        return authService.isPatient();
    };

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