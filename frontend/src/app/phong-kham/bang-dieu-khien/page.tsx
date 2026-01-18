// frontend/src/app/phong-kham/bang-dieu-khien/page.tsx
'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ClinicDashboardPage() {
    return (
        <ProtectedRoute allowedRoles={['ClinicAdmin']}>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard Phòng Khám</h1>
                <p className="text-gray-600 mb-8">Chào mừng quản lý phòng khám</p>

                <Card>
                    <CardHeader>
                        <CardTitle>Trang quản lý phòng khám</CardTitle>
                        <CardDescription>Trang đang được phát triển</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🏥</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Tính năng đang phát triển</h3>
                            <p className="text-gray-500">Dashboard phòng khám sẽ sớm có mặt!</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}