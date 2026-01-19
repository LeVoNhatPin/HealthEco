'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
    adminOnly?: boolean;
}

export function ProtectedRoute({
    children,
    allowedRoles,
    adminOnly = false,
}: ProtectedRouteProps) {
    const { isAuthenticated, user, isLoading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        // Chưa đăng nhập
        if (!isAuthenticated) {
            router.replace('/dang-nhap');
            return;
        }

        // Admin only
        if (adminOnly && !isAdmin()) {
            router.replace('/khong-co-quyen');
            return;
        }

        // Role cụ thể (bỏ qua nếu adminOnly = true)
        if (!adminOnly && allowedRoles && user && !allowedRoles.includes(user.role)) {
            router.replace('/khong-co-quyen');
        }
    }, [isAuthenticated, isLoading, user, allowedRoles, adminOnly, isAdmin, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }

    // ❌ Không render nếu không đủ quyền
    if (!isAuthenticated) return null;
    if (adminOnly && !isAdmin()) return null;
    if (!adminOnly && allowedRoles && user && !allowedRoles.includes(user.role))
        return null;

    return <>{children}</>;
}
