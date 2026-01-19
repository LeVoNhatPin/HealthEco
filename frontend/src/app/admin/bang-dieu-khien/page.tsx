// frontend/src/app/admin/bang-dieu-khien/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/services/admin.service';
import {
    Users,
    UserCheck,
    Stethoscope,
    Building,
    Calendar,
    DollarSign,
    TrendingUp,
    Activity,
    AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        patients: 0,
        doctors: 0,
        admins: 0,
        inactiveUsers: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const response = await adminService.getSystemStats();

            if (response.success) {
                setStats(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err: any) {
            console.error('Error loading stats:', err);
            setError(err.message || 'Không thể tải thống kê');

            // Mock data for development
            setStats({
                totalUsers: 1245,
                activeUsers: 845,
                patients: 1000,
                doctors: 89,
                admins: 12,
                inactiveUsers: 400,
            });
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Tổng người dùng',
            value: stats.totalUsers,
            icon: Users,
            color: 'bg-blue-500',
            href: '/admin/nguoi-dung'
        },
        {
            title: 'Bệnh nhân',
            value: stats.patients,
            icon: Users,
            color: 'bg-green-500',
            href: '/admin/nguoi-dung?role=Patient'
        },
        {
            title: 'Bác sĩ',
            value: stats.doctors,
            icon: Stethoscope,
            color: 'bg-purple-500',
            href: '/admin/bac-si'
        },
        {
            title: 'Đang hoạt động',
            value: stats.activeUsers,
            icon: UserCheck,
            color: 'bg-yellow-500',
            href: '/admin/nguoi-dung?status=active'
        },
        {
            title: 'Quản trị viên',
            value: stats.admins,
            icon: Users,
            color: 'bg-red-500',
            href: '/admin/nguoi-dung?role=admin'
        },
        {
            title: 'Không hoạt động',
            value: stats.inactiveUsers,
            icon: Users,
            color: 'bg-gray-500',
            href: '/admin/nguoi-dung?status=inactive'
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Xin chào, {user?.fullName}</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                    <p className="text-2xl font-bold mt-2">{card.value.toLocaleString()}</p>
                                </div>
                                <div className={`${card.color} p-3 rounded-full`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-lg font-semibold mb-4">Hoạt động gần đây</h2>
                    <div className="space-y-4">
                        {[
                            { user: 'Nguyễn Văn A', action: 'Đăng ký tài khoản', time: '5 phút trước' },
                            { user: 'Dr. Trần Thị B', action: 'Đăng ký bác sĩ', time: '15 phút trước' },
                            { user: 'Phòng khám XYZ', action: 'Cập nhật thông tin', time: '30 phút trước' },
                            { user: 'Admin', action: 'Xác minh bác sĩ', time: '1 giờ trước' },
                        ].map((activity, index) => (
                            <div key={index} className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="font-medium">{activity.user}</p>
                                    <p className="text-sm text-gray-600">{activity.action}</p>
                                </div>
                                <div className="ml-auto text-sm text-gray-500">
                                    {activity.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-lg font-semibold mb-4">Hệ thống</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>CPU</span>
                                <span className="font-medium">24%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '24%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Bộ nhớ</span>
                                <span className="font-medium">68%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: '68%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Lưu trữ</span>
                                <span className="font-medium">42%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '42%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}