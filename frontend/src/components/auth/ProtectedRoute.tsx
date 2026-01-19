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
    const {
        isAuthenticated,
        user,
        isLoading,
        isAdmin,
    } = useAuth();

    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        // Chưa đăng nhập
        if (!isAuthenticated) {
            router.push('/dang-nhap');
            return;
        }

        // Chỉ cho admin
        if (adminOnly && !isAdmin()) {
            router.push('/khong-co-quyen');
            return;
        }

        // Check role cụ thể
        if (allowedRoles && user && !allowedRoles.includes(user.role)) {
            router.push('/khong-co-quyen');
        }
    }, [isAuthenticated, isLoading, user, allowedRoles, adminOnly, isAdmin, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }

    if (
        !isAuthenticated ||
        (adminOnly && !isAdmin()) ||
        (allowedRoles && user && !allowedRoles.includes(user.role))
    ) {
        return null;
    }

    return <>{children}</>;
}
