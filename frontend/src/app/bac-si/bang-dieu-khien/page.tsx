// frontend/src/app/bac-si/bang-dieu-khien/page.tsx
'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { doctorService } from '@/services/doctor.service';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock, DollarSign, Activity, BarChart, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function DoctorDashboardContent() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        totalAppointments: 0,
        pendingAppointments: 0,
        totalPatients: 0,
        monthlyRevenue: 0,
    });
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDoctorData = async () => {
            if (!user) return;

            try {
                setError(null);

                // Lấy doctorId từ user (có thể cần lấy từ API)
                let doctorId: number | null = null;

                if (user.role === 'Doctor') {
                    const doctorResponse = await doctorService.getDoctorByUserId(user.id);

                    if (doctorResponse?.success && doctorResponse.data) {
                        doctorId = doctorResponse.data.id;
                    }
                }

                // Nếu chưa có doctorId, thử lấy từ API
                if (!doctorId && user.role === 'Doctor') {
                    try {
                        const doctorResponse = await doctorService.getDoctorByUserId(user.id);
                        if (doctorResponse.success && doctorResponse.data) {
                            doctorId = doctorResponse.data.id;
                        }
                    } catch (err) {
                        console.error('Không tìm thấy thông tin bác sĩ:', err);
                    }
                }

                if (!doctorId) {
                    setError('Không tìm thấy thông tin bác sĩ');
                    setLoading(false);
                    return;
                }

                // Gọi API lấy thống kê
                const statsResponse = await doctorService.getDoctorStats(doctorId);
                if (statsResponse.success && statsResponse.data) {
                    setStats(statsResponse.data);
                }

                // Gọi API lấy lịch hẹn gần đây
                const appointmentsResponse = await doctorService.getDoctorAppointments(doctorId, {
                    page: 1,
                    limit: 5,
                    status: 'all'
                });
                if (appointmentsResponse.success && appointmentsResponse.data) {
                    setAppointments(appointmentsResponse.data.items || appointmentsResponse.data);
                }

            } catch (err: any) {
                console.error('Lỗi tải dữ liệu:', err);
                setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');

                // Fallback data cho demo
                setStats({
                    totalAppointments: 45,
                    pendingAppointments: 8,
                    totalPatients: 32,
                    monthlyRevenue: 12500000,
                });
            } finally {
                setLoading(false);
            }
        };

        loadDoctorData();
    }, [user]);

    const statsData = [
        {
            title: 'Tổng cuộc hẹn',
            value: stats.totalAppointments,
            icon: Calendar,
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Cuộc hẹn chờ xử lý',
            value: stats.pendingAppointments,
            icon: Clock,
            color: 'bg-yellow-500',
            textColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
        },
        {
            title: 'Tổng bệnh nhân',
            value: stats.totalPatients,
            icon: Users,
            color: 'bg-green-500',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            title: 'Doanh thu tháng',
            value: `${stats.monthlyRevenue.toLocaleString()} VNĐ`,
            icon: DollarSign,
            color: 'bg-purple-500',
            textColor: 'text-purple-600',
            bgColor: 'bg-purple-50'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Lỗi tải dữ liệu</h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <Button onClick={() => window.location.reload()}>
                                Thử lại
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
                                Bác Sĩ
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
                    {statsData.map((stat, index) => {
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
                        {appointments.length > 0 ? (
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
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {appointments.slice(0, 5).map((appointment: any) => (
                                            <tr key={appointment.id}>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">
                                                        {appointment.patientName || appointment.patient?.fullName || 'Không có tên'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')}
                                                    <br />
                                                    {appointment.startTime} - {appointment.endTime}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                                        {appointment.type || 'Khám tổng quát'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${appointment.status === 'CONFIRMED'
                                                        ? 'bg-green-100 text-green-800'
                                                        : appointment.status === 'PENDING'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : appointment.status === 'CANCELLED'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {appointment.status === 'CONFIRMED' ? 'Đã xác nhận' :
                                                            appointment.status === 'PENDING' ? 'Chờ xác nhận' :
                                                                appointment.status === 'CANCELLED' ? 'Đã hủy' :
                                                                    appointment.status === 'COMPLETED' ? 'Đã hoàn thành' : appointment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                <p>Chưa có cuộc hẹn nào</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
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