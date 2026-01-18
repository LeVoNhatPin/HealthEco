// frontend/src/app/admin/bang-dieu-khien/page.tsx
'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/services/admin.service';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building, Stethoscope, DollarSign, Activity, Shield, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

function AdminDashboardContent() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        totalClinics: 0,
        totalAppointments: 0,
        monthlyRevenue: 0,
        pendingVerifications: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAdminData = async () => {
            try {
                const response = await adminService.getSystemStats();
                if (response.success && response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error('Error loading admin data:', error);
                // Fallback data
                setStats({
                    totalUsers: 1245,
                    totalDoctors: 89,
                    totalClinics: 56,
                    totalAppointments: 2345,
                    monthlyRevenue: 125000000,
                    pendingVerifications: 12,
                });
            } finally {
                setLoading(false);
            }
        };

        loadAdminData();
    }, []);

    const statsData = [
        { title: 'Tổng người dùng', value: stats.totalUsers, icon: Users, color: 'bg-blue-500', change: '+12%' },
        { title: 'Tổng bác sĩ', value: stats.totalDoctors, icon: Stethoscope, color: 'bg-green-500', change: '+5%' },
        { title: 'Tổng phòng khám', value: stats.totalClinics, icon: Building, color: 'bg-purple-500', change: '+3%' },
        { title: 'Cuộc hẹn', value: stats.totalAppointments, icon: Activity, color: 'bg-orange-500', change: '+23%' },
        { title: 'Doanh thu tháng', value: `${(stats.monthlyRevenue / 1000000).toFixed(1)}M VNĐ`, icon: DollarSign, color: 'bg-yellow-500', change: '+15%' },
        { title: 'Chờ xác minh', value: stats.pendingVerifications, icon: Clock, color: 'bg-red-500', change: '-8%' },
    ];

    const quickActions = [
        { title: 'Quản lý người dùng', icon: Users, href: '/admin/nguoi-dung', color: 'bg-blue-100 text-blue-700' },
        { title: 'Quản lý bác sĩ', icon: Stethoscope, href: '/admin/bac-si', color: 'bg-green-100 text-green-700' },
        { title: 'Quản lý phòng khám', icon: Building, href: '/admin/phong-kham', color: 'bg-purple-100 text-purple-700' },
        { title: 'Xác minh tài khoản', icon: Shield, href: '/admin/xac-minh', color: 'bg-yellow-100 text-yellow-700' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Dashboard Quản trị Hệ thống
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Chào mừng quản trị viên, <span className="font-semibold">{user?.fullName}</span>!
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                                Quản trị viên
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {statsData.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="overflow-hidden border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                            <p className="text-2xl font-bold mt-2">{stat.value}</p>
                                            <div className="flex items-center mt-2">
                                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                                <span className="text-sm text-green-600">{stat.change}</span>
                                                <span className="text-sm text-gray-500 ml-2">so với tháng trước</span>
                                            </div>
                                        </div>
                                        <div className={`${stat.color} p-3 rounded-full`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <Card className="mb-8 border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle>Hành động nhanh</CardTitle>
                        <CardDescription>Truy cập nhanh các tính năng quản trị</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {quickActions.map((action, index) => {
                                const Icon = action.icon;
                                return (
                                    <Link
                                        key={index}
                                        href={action.href}
                                        className={`${action.color} rounded-lg p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow`}
                                    >
                                        <Icon className="h-8 w-8 mb-2" />
                                        <span className="font-medium text-center">{action.title}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Charts/Stats Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle>Hoạt động hệ thống</CardTitle>
                            <CardDescription>Tổng quan 7 ngày qua</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                <div className="text-center text-gray-500">
                                    <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                    <p>Biểu đồ hoạt động hệ thống</p>
                                    <p className="text-sm mt-2">(Sẽ được cập nhật sau)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle>Thông báo & Cảnh báo</CardTitle>
                            <CardDescription>Các vấn đề cần xử lý</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                                    <p className="font-medium text-yellow-800">⚠️ 12 tài khoản bác sĩ chờ xác minh</p>
                                    <p className="text-sm text-yellow-600 mt-1">Cần xem xét và phê duyệt</p>
                                    <Link href="/admin/xac-minh" className="text-sm text-yellow-700 font-medium mt-2 inline-block">
                                        Xử lý ngay →
                                    </Link>
                                </div>
                                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                                    <p className="font-medium text-red-800">🔴 3 phòng khám báo cáo sự cố</p>
                                    <p className="text-sm text-red-600 mt-1">Cần hỗ trợ kỹ thuật</p>
                                    <Link href="/admin/su-co" className="text-sm text-red-700 font-medium mt-2 inline-block">
                                        Xem chi tiết →
                                    </Link>
                                </div>
                                <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                                    <p className="font-medium text-blue-800">📈 Doanh thu tháng tăng 15%</p>
                                    <p className="text-sm text-blue-600 mt-1">So với tháng trước</p>
                                    <Link href="/admin/bao-cao" className="text-sm text-blue-700 font-medium mt-2 inline-block">
                                        Xem báo cáo →
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activities */}
                <Card className="mt-8 border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle>Hoạt động gần đây</CardTitle>
                        <CardDescription>Lịch sử hoạt động trên hệ thống</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { action: 'Người dùng mới đăng ký', user: 'Nguyễn Văn A', time: '5 phút trước', type: 'user' },
                                { action: 'Bác sĩ mới đăng ký', user: 'Dr. Trần Thị B', time: '15 phút trước', type: 'doctor' },
                                { action: 'Cuộc hẹn được tạo', user: 'Lê Văn C', time: '30 phút trước', type: 'appointment' },
                                { action: 'Thanh toán thành công', user: 'Phạm Thị D', time: '1 giờ trước', type: 'payment' },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-full ${activity.type === 'user' ? 'bg-blue-100' :
                                                activity.type === 'doctor' ? 'bg-green-100' :
                                                    activity.type === 'appointment' ? 'bg-purple-100' : 'bg-yellow-100'
                                            }`}>
                                            {activity.type === 'user' && <Users className="h-4 w-4" />}
                                            {activity.type === 'doctor' && <Stethoscope className="h-4 w-4" />}
                                            {activity.type === 'appointment' && <Activity className="h-4 w-4" />}
                                            {activity.type === 'payment' && <DollarSign className="h-4 w-4" />}
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-medium">{activity.action}</p>
                                            <p className="text-sm text-gray-500">Bởi {activity.user} • {activity.time}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">Chi tiết</Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

export default function AdminDashboardPage() {
    return (
        <ProtectedRoute allowedRoles={['SystemAdmin']}>
            <AdminDashboardContent />
        </ProtectedRoute>
    );
}