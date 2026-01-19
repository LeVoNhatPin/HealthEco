'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { authService } from '@/services/auth.service';
import { AuthResponse, User } from '@/types/auth';
import { ApiResponse } from '@/types/api';

/* ===================== TYPES ===================== */

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<ApiResponse<AuthResponse>>;
    logout: () => Promise<void>;

    updateProfile: (data: any) => Promise<ApiResponse<User>>;
    changePassword: (
        currentPassword: string,
        newPassword: string
    ) => Promise<ApiResponse<void>>;
    refreshUser: () => Promise<void>;

    hasRole: (role: string) => boolean;
    isAdmin: () => boolean;
    isSystemAdmin: () => boolean;
    isClinicAdmin: () => boolean;
    isDoctor: () => boolean;
    isPatient: () => boolean;

    getRedirectPath: (user: User) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ===================== HOOK ===================== */

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

/* ===================== PROVIDER ===================== */

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    /* ===================== INIT AUTH ===================== */

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

    /* ===================== REDIRECT ===================== */

    const getRedirectPath = (user: User): string => {
        console.log('🔍 Redirect role:', user.role);

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

    /* ===================== AUTH ACTIONS ===================== */

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.login({ email, password });

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Đăng nhập thất bại');
            }

            const userData = response.data.user;
            setUser(userData);

            toast.success(response.message || 'Đăng nhập thành công');
            router.push(getRedirectPath(userData));
        } catch (error: any) {
            toast.error(error?.message || 'Đăng nhập thất bại');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: any) => {
        setIsLoading(true);
        try {
            const response = await authService.register(data);

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Đăng ký thất bại');
            }

            const userData = response.data.user;
            setUser(userData);

            toast.success(response.message || 'Đăng ký thành công');
            router.push(getRedirectPath(userData));

            return response;
        } catch (error: any) {
            toast.error(error?.message || 'Đăng ký thất bại');
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

            toast.success('Đăng xuất thành công');
            router.push('/dang-nhap');
        } catch {
            toast.error('Đăng xuất thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    /* ===================== PROFILE ===================== */

    const updateProfile = async (data: any): Promise<ApiResponse<User>> => {
        setIsLoading(true);
        try {
            const response = await authService.updateProfile(data);

            if (response.success && response.data) {
                setUser(response.data);
                toast.success(response.message || 'Cập nhật thành công');
            } else {
                toast.error(response.message || 'Cập nhật thất bại');
            }

            return response;
        } catch (error: any) {
            toast.error(error?.message || 'Cập nhật thất bại');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const changePassword = async (
        currentPassword: string,
        newPassword: string
    ): Promise<ApiResponse<void>> => {
        setIsLoading(true);
        try {
            const response = await authService.changePassword(
                currentPassword,
                newPassword
            );

            response.success
                ? toast.success(response.message || 'Đổi mật khẩu thành công')
                : toast.error(response.message || 'Đổi mật khẩu thất bại');

            return response;
        } catch (error: any) {
            toast.error(error?.message || 'Đổi mật khẩu thất bại');
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
            console.error('Refresh user failed:', error);
        }
    };

    /* ===================== ROLE HELPERS ===================== */

    const hasRole = (role: string): boolean =>
        !!user && user.role === role;

    const isSystemAdmin = (): boolean => hasRole('SystemAdmin');
    const isClinicAdmin = (): boolean => hasRole('ClinicAdmin');
    const isAdmin = (): boolean =>
        isSystemAdmin() || isClinicAdmin();

    const isDoctor = (): boolean => hasRole('Doctor');
    const isPatient = (): boolean => hasRole('Patient');

    /* ===================== CONTEXT VALUE ===================== */

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
        isSystemAdmin,
        isClinicAdmin,
        isDoctor,
        isPatient,

        getRedirectPath,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
