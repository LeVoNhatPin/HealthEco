"use client";

import { useState, useEffect } from "react";
import { appointmentService } from "@/services/appointment.service";
import { authService } from "@/services/auth.service";

export default function DashboardPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const currentUser = authService.getUser();
            setUser(currentUser);

            const appointmentsData = await appointmentService.getMyAppointments();
            setAppointments(appointmentsData.data || []);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async (id: number) => {
        if (confirm("Bạn có chắc muốn hủy lịch hẹn này?")) {
            try {
                await appointmentService.cancelAppointment(id);
                alert("Hủy lịch hẹn thành công!");
                loadData(); // Refresh data
            } catch (error: any) {
                alert(error.message || "Có lỗi xảy ra");
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "CONFIRMED":
                return "bg-blue-100 text-blue-800";
            case "CHECKED_IN":
                return "bg-purple-100 text-purple-800";
            case "COMPLETED":
                return "bg-green-100 text-green-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toUpperCase()) {
            case "PENDING": return "Chờ xác nhận";
            case "CONFIRMED": return "Đã xác nhận";
            case "CHECKED_IN": return "Đã check-in";
            case "COMPLETED": return "Đã hoàn thành";
            case "CANCELLED": return "Đã hủy";
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Bảng điều khiển</h1>

            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl p-6 mb-8 shadow-lg">
                <h2 className="text-xl font-semibold mb-2">
                    Xin chào, {user?.fullName}!
                </h2>
                <p className="opacity-90">
                    {user?.role === "Patient" && "Chào mừng bạn đến với HealthEco"}
                    {user?.role === "Doctor" && "Chào mừng bác sĩ đến với hệ thống"}
                    {user?.role === "SystemAdmin" && "Chào mừng quản trị viên"}
                </p>
            </div>

            {/* Appointments Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">
                        {user?.role === "Patient" && "Lịch hẹn của tôi"}
                        {user?.role === "Doctor" && "Lịch hẹn với bệnh nhân"}
                    </h2>
                    {appointments.length > 0 && (
                        <span className="text-sm text-gray-500">
                            Tổng: {appointments.length} lịch hẹn
                        </span>
                    )}
                </div>

                {appointments.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="text-gray-400 text-5xl mb-4">📅</div>
                        <p className="text-gray-500 mb-4">Chưa có lịch hẹn nào</p>
                        {user?.role === "Patient" && (
                            <a
                                href="/dat-lich"
                                className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
                            >
                                Đặt lịch ngay
                            </a>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-3 text-left">Mã lịch hẹn</th>
                                    {user?.role === "Patient" && (
                                        <th className="px-4 py-3 text-left">Bác sĩ</th>
                                    )}
                                    {user?.role === "Doctor" && (
                                        <th className="px-4 py-3 text-left">Bệnh nhân</th>
                                    )}
                                    <th className="px-4 py-3 text-left">Ngày giờ</th>
                                    <th className="px-4 py-3 text-left">Cơ sở</th>
                                    <th className="px-4 py-3 text-left">Trạng thái</th>
                                    <th className="px-4 py-3 text-left">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((apt) => (
                                    <tr key={apt.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono text-sm">
                                            {apt.appointmentCode}
                                        </td>
                                        {user?.role === "Patient" && (
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{apt.doctorName}</div>
                                                <div className="text-sm text-gray-500">
                                                    {apt.consultationFee.toLocaleString()} VNĐ
                                                </div>
                                            </td>
                                        )}
                                        {user?.role === "Doctor" && (
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{apt.patientName}</div>
                                            </td>
                                        )}
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{apt.appointmentDate}</div>
                                            <div className="text-sm text-gray-500">{apt.startTime}</div>
                                        </td>
                                        <td className="px-4 py-3">{apt.facilityName}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                    apt.status
                                                )}`}
                                            >
                                                {getStatusText(apt.status)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => window.location.href = `/lich-hen/${apt.id}`}
                                                    className="text-primary hover:underline text-sm"
                                                >
                                                    Xem chi tiết
                                                </button>
                                                {user?.role === "Patient" &&
                                                    apt.status === "PENDING" && (
                                                        <button
                                                            onClick={() => handleCancelAppointment(apt.id)}
                                                            className="text-red-600 hover:underline text-sm"
                                                        >
                                                            Hủy lịch
                                                        </button>
                                                    )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-medium mb-4">Thao tác nhanh</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {user?.role === "Patient" && (
                        <>
                            <a
                                href="/dat-lich"
                                className="bg-primary text-white p-4 rounded-lg hover:bg-primary-dark transition text-center"
                            >
                                <div className="text-2xl mb-2">🩺</div>
                                <div className="font-medium">Đặt lịch mới</div>
                            </a>
                            <a
                                href="/bac-si"
                                className="bg-blue-50 text-primary p-4 rounded-lg hover:bg-blue-100 transition text-center border border-blue-100"
                            >
                                <div className="text-2xl mb-2">👨‍⚕️</div>
                                <div className="font-medium">Tìm bác sĩ</div>
                            </a>
                            <a
                                href="/phong-kham"
                                className="bg-green-50 text-green-700 p-4 rounded-lg hover:bg-green-100 transition text-center border border-green-100"
                            >
                                <div className="text-2xl mb-2">🏥</div>
                                <div className="font-medium">Tìm phòng khám</div>
                            </a>
                            <a
                                href="/bang-dieu-khien/profile"
                                className="bg-purple-50 text-purple-700 p-4 rounded-lg hover:bg-purple-100 transition text-center border border-purple-100"
                            >
                                <div className="text-2xl mb-2">👤</div>
                                <div className="font-medium">Hồ sơ cá nhân</div>
                            </a>
                        </>
                    )}
                    {user?.role === "Doctor" && (
                        <>
                            <a
                                href="/bac-si/lich-trinh"
                                className="bg-primary text-white p-4 rounded-lg hover:bg-primary-dark transition text-center"
                            >
                                <div className="text-2xl mb-2">📅</div>
                                <div className="font-medium">Quản lý lịch trực</div>
                            </a>
                            <a
                                href="/bac-si/lich-hen"
                                className="bg-blue-50 text-primary p-4 rounded-lg hover:bg-blue-100 transition text-center border border-blue-100"
                            >
                                <div className="text-2xl mb-2">👥</div>
                                <div className="font-medium">Xem lịch hẹn</div>
                            </a>
                            <a
                                href="/bac-si/benh-nhan"
                                className="bg-green-50 text-green-700 p-4 rounded-lg hover:bg-green-100 transition text-center border border-green-100"
                            >
                                <div className="text-2xl mb-2">📋</div>
                                <div className="font-medium">Danh sách bệnh nhân</div>
                            </a>
                            <a
                                href="/bac-si/ho-so"
                                className="bg-purple-50 text-purple-700 p-4 rounded-lg hover:bg-purple-100 transition text-center border border-purple-100"
                            >
                                <div className="text-2xl mb-2">👤</div>
                                <div className="font-medium">Hồ sơ bác sĩ</div>
                            </a>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}