'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
    Calendar,
    Clock,
    User,
    Stethoscope,
    Building,
    Bell,
} from 'lucide-react';

import { appointmentService } from '@/services/appointment.service';

function DashboardContent() {
    const { user } = useAuth();

    const [appointments, setAppointments] = useState<any[]>([]);
    const [loadingAppointments, setLoadingAppointments] = useState(false);

    // ===============================
    // FETCH APPOINTMENTS
    // ===============================
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoadingAppointments(true);
                const res = await appointmentService.getMyAppointments();
                setAppointments(res?.data || res || []);
            } catch (error) {
                console.error('Lỗi tải lịch hẹn:', error);
            } finally {
                setLoadingAppointments(false);
            }
        };

        fetchAppointments();
    }, []);

    // ===============================
    // CALCULATE STATS
    // ===============================
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = useMemo(() => {
        const todayAppointments = appointments.filter((a) => {
            const d = new Date(a.appointmentDate);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
        });

        const upcomingAppointments = appointments.filter(
            (a) => new Date(a.appointmentDate) > new Date()
        );

        const doctors = new Set(
            appointments
                .filter((a) => a.status === 'Completed')
                .map((a) => a.doctor?.user?.fullName)
        );

        const facilities = new Set(
            appointments
                .filter((a) => a.status === 'Completed')
                .map((a) => a.medicalFacility?.name)
        );

        return {
            todayCount: todayAppointments.length,
            upcomingCount: upcomingAppointments.length,
            doctorCount: doctors.size,
            facilityCount: facilities.size,
        };
    }, [appointments]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* WELCOME */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Chào mừng trở lại, {user?.fullName}!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Đây là bảng điều khiển của bạn.
                    </p>
                </div>

                {/* ROLE */}
                <div className="mb-8">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100">
                        <span className="text-blue-800 font-medium capitalize">
                            Vai trò: {user?.role}
                        </span>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="pt-6 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Lịch hẹn hôm nay
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.todayCount}
                                </p>
                            </div>
                            <Calendar className="h-10 w-10 text-blue-500" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Lịch hẹn sắp tới
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.upcomingCount}
                                </p>
                            </div>
                            <Clock className="h-10 w-10 text-green-500" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Bác sĩ đã khám
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.doctorCount}
                                </p>
                            </div>
                            <Stethoscope className="h-10 w-10 text-purple-500" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Phòng khám đã đến
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.facilityCount}
                                </p>
                            </div>
                            <Building className="h-10 w-10 text-orange-500" />
                        </CardContent>
                    </Card>
                </div>

                {/* QUICK ACTIONS + NOTIFICATIONS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hành Động Nhanh</CardTitle>
                            <CardDescription>
                                Thao tác nhanh với tài khoản
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/bang-dieu-khien/profile">
                                <Button className="w-full justify-start" variant="outline">
                                    <User className="mr-2 h-4 w-4" />
                                    Hồ sơ cá nhân
                                </Button>
                            </Link>

                            <Link href="/bang-dieu-khien/lich-hen">
                                <Button className="w-full justify-start" variant="outline">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Lịch hẹn
                                </Button>
                            </Link>

                            <Link href="/dat-lich">
                                <Button className="w-full justify-start" variant="outline">
                                    <Clock className="mr-2 h-4 w-4" />
                                    Đặt lịch mới
                                </Button>
                            </Link>

                            <Link href="/bac-si">
                                <Button className="w-full justify-start" variant="outline">
                                    <Stethoscope className="mr-2 h-4 w-4" />
                                    Tìm bác sĩ
                                </Button>
                            </Link>

                            <Link href="/phong-kham">
                                <Button className="w-full justify-start" variant="outline">
                                    <Building className="mr-2 h-4 w-4" />
                                    Tìm phòng khám
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Thông báo</CardTitle>
                            <CardDescription>Cập nhật mới</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Bell className="h-5 w-5 text-blue-500 mt-1" />
                                <div>
                                    <p className="font-medium">
                                        Chào mừng đến HealthEco
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Cảm ơn bạn đã sử dụng hệ thống.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RECENT APPOINTMENTS */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Lịch hẹn gần đây</CardTitle>
                        <CardDescription>
                            5 lịch hẹn mới nhất
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {loadingAppointments && <p>Đang tải...</p>}

                        {!loadingAppointments && appointments.length === 0 && (
                            <p className="text-sm text-gray-500">
                                Bạn chưa có lịch hẹn nào
                            </p>
                        )}

                        <div className="space-y-4">
                            {appointments.slice(0, 5).map((appt) => (
                                <div
                                    key={appt.id}
                                    className="flex justify-between items-center border rounded-lg p-4"
                                >
                                    <div>
                                        <p className="font-medium">
                                            BS. {appt.doctor?.user?.fullName}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {appt.doctor?.specialization?.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(
                                                appt.appointmentDate
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <span
                                        className={`px-3 py-1 text-sm rounded-full ${
                                            appt.status === 'Confirmed'
                                                ? 'bg-green-100 text-green-700'
                                                : appt.status === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : appt.status === 'Completed'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {appt.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Link href="/bang-dieu-khien/lich-hen">
                            <Button className="w-full mt-4" variant="outline">
                                Xem tất cả lịch hẹn
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* ADMIN */}
                {user?.role === 'SystemAdmin' && (
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Quản trị hệ thống</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Link href="/admin">
                                <Button className="w-full">
                                    Admin Dashboard
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}
