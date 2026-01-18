// frontend/src/app/bac-si/bang-dieu-khien/page.tsx
'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock, DollarSign, Activity, BarChart } from 'lucide-react';
import Link from 'next/link';

function DoctorDashboardContent() {
    const { user, logout } = useAuth();

    const stats = [
        {
            title: 'Cuộc hẹn hôm nay',
            value: '12',
            icon: Calendar,
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Tổng bệnh nhân',
            value: '156',
            icon: Users,
            color: 'bg-green-500',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            title: 'Đang chờ',
            value: '8',
            icon: Clock,
            color: 'bg-yellow-500',
            textColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
        },
        {
            title: 'Doanh thu tháng',
            value: '25.4tr',
            icon: DollarSign,
            color: 'bg-purple-500',
            textColor: 'text-purple-600',
            bgColor: 'bg-purple-50'
        }
    ];

    const quickActions = [
        { title: 'Lịch hẹn', icon: Calendar, href: '/bac-si/lich-hen', color: 'bg-blue-100 text-blue-700' },
        { title: 'Bệnh nhân', icon: Users, href: '/bac-si/benh-nhan', color: 'bg-green-100 text-green-700' },
        { title: 'Lịch trình', icon: Clock, href: '/bac-si/lich-trinh', color: 'bg-yellow-100 text-yellow-700' },
        { title: 'Hồ sơ', icon: Activity, href: '/bac-si/ho-so', color: 'bg-purple-100 text-purple-700' },
    ];

    const appointments = [
        { id: 1, patient: 'Nguyễn Văn A', time: '09:00 - 09:30', type: 'Khám tổng quát', status: 'Đã xác nhận' },
        { id: 2, patient: 'Trần Thị B', time: '10:00 - 10:30', type: 'Tái khám', status: 'Chờ xác nhận' },
        { id: 3, patient: 'Lê Văn C', time: '14:00 - 14:45', type: 'Tư vấn online', status: 'Đã xác nhận' },
        { id: 4, patient: 'Phạm Thị D', time: '15:30 - 16:15', type: 'Khám chuyên khoa', status: 'Đang chờ' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Dashboard Bác Sĩ
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Chào mừng trở lại, <span className="font-semibold">Dr. {user?.fullName}</span>!
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                {user?.role === 'Doctor' ? 'Bác Sĩ' : user?.role}
                            </span>
                            <Button
                                onClick={logout}
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                                Đăng xuất
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="overflow-hidden border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                            <p className="text-2xl font-bold mt-2">{stat.value}</p>
                                        </div>
                                        <div className={`${stat.bgColor} p-3 rounded-full`}>
                                            <Icon className={`h-6 w-6 ${stat.textColor}`} />
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
                        <CardDescription>Truy cập nhanh các tính năng quan trọng</CardDescription>
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

                {/* Recent Appointments */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle>Cuộc hẹn gần đây</CardTitle>
                                <CardDescription>Danh sách các cuộc hẹn sắp tới</CardDescription>
                            </div>
                            <Link
                                href="/bac-si/lich-hen"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Xem tất cả →
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bệnh nhân
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thời gian
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Loại khám
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{appointment.patient}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {appointment.time}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                                    {appointment.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${appointment.status === 'Đã xác nhận'
                                                        ? 'bg-green-100 text-green-800'
                                                        : appointment.status === 'Chờ xác nhận'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {appointment.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <Button size="sm" variant="outline">
                                                    Xem chi tiết
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Charts/Stats Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle>Thống kê cuộc hẹn</CardTitle>
                            <CardDescription>Theo tuần này</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                <div className="text-center text-gray-500">
                                    <BarChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                    <p>Biểu đồ thống kê cuộc hẹn</p>
                                    <p className="text-sm mt-2">(Sẽ được cập nhật sau)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle>Thông báo</CardTitle>
                            <CardDescription>Cập nhật mới nhất</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="font-medium text-blue-800">🎉 Chào mừng đến với hệ thống!</p>
                                    <p className="text-sm text-blue-600 mt-1">Đây là dashboard dành riêng cho bác sĩ.</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <p className="font-medium text-green-800">📅 Có 3 cuộc hẹn mới</p>
                                    <p className="text-sm text-green-600 mt-1">Cần xác nhận trước 2 giờ.</p>
                                </div>
                                <div className="p-3 bg-yellow-50 rounded-lg">
                                    <p className="font-medium text-yellow-800">⚠️ Lịch trình ngày mai</p>
                                    <p className="text-sm text-yellow-600 mt-1">Bạn có 8 cuộc hẹn vào ngày mai.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

export default function DoctorDashboardPage() {
    return (
        <ProtectedRoute allowedRoles={['Doctor']}>
            <DoctorDashboardContent />
        </ProtectedRoute>
    );
}