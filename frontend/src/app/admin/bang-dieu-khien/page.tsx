// frontend/src/app/admin/bang-dieu-khien/page.tsx
'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
    return (
        <ProtectedRoute allowedRoles={['SystemAdmin']}>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard Quản trị Hệ thống</h1>
                <p className="text-gray-600 mb-8">Chào mừng quản trị viên hệ thống</p>

                <Card>
                    <CardHeader>
                        <CardTitle>Trang quản trị hệ thống</CardTitle>
                        <CardDescription>Trang đang được phát triển</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🛡️</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Tính năng đang phát triển</h3>
                            <p className="text-gray-500">Dashboard quản trị hệ thống sẽ sớm có mặt!</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}