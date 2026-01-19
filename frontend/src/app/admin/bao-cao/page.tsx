// frontend/src/app/admin/bao-cao/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/admin.service';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    Calendar,
    DollarSign,
    Download,
    Filter
} from 'lucide-react';

export default function ReportsPage() {
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('month'); // 'day', 'week', 'month', 'year'

    useEffect(() => {
        loadReportData();
    }, [dateRange]);

    const loadReportData = async () => {
        try {
            setLoading(true);
            const response = await adminService.getReports({ period: dateRange });

            if (response.success) {
                setReportData(response.data);
            } else {
                // Mock data cho demo
                setReportData({
                    totalAppointments: 1245,
                    totalRevenue: 125000000,
                    newUsers: 89,
                    completedAppointments: 1120,
                    cancelledAppointments: 85,
                    pendingAppointments: 40,
                    revenueByMonth: [
                        { month: 'T1', revenue: 10000000 },
                        { month: 'T2', revenue: 15000000 },
                        { month: 'T3', revenue: 12000000 },
                        { month: 'T4', revenue: 18000000 },
                        { month: 'T5', revenue: 20000000 },
                        { month: 'T6', revenue: 22000000 },
                    ],
                    topDoctors: [
                        { name: 'Dr. Nguyễn Văn A', appointments: 156, revenue: 46800000 },
                        { name: 'Dr. Trần Thị B', appointments: 142, revenue: 42600000 },
                        { name: 'Dr. Lê Văn C', appointments: 128, revenue: 38400000 },
                    ]
                });
            }
        } catch (error) {
            console.error('Error loading report data:', error);
            // Mock data khi API lỗi
            setReportData({
                totalAppointments: 1245,
                totalRevenue: 125000000,
                newUsers: 89,
                completedAppointments: 1120,
                cancelledAppointments: 85,
                pendingAppointments: 40,
                revenueByMonth: [
                    { month: 'T1', revenue: 10000000 },
                    { month: 'T2', revenue: 15000000 },
                    { month: 'T3', revenue: 12000000 },
                    { month: 'T4', revenue: 18000000 },
                    { month: 'T5', revenue: 20000000 },
                    { month: 'T6', revenue: 22000000 },
                ],
                topDoctors: [
                    { name: 'Dr. Nguyễn Văn A', appointments: 156, revenue: 46800000 },
                    { name: 'Dr. Trần Thị B', appointments: 142, revenue: 42600000 },
                    { name: 'Dr. Lê Văn C', appointments: 128, revenue: 38400000 },
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
                    <p className="text-gray-600">Thống kê chi tiết về hoạt động hệ thống</p>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="day">Hôm nay</option>
                        <option value="week">Tuần này</option>
                        <option value="month">Tháng này</option>
                        <option value="year">Năm nay</option>
                    </select>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center">
                        <Download className="h-4 w-4 mr-2" />
                        Xuất báo cáo
                    </button>
                </div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng cuộc hẹn</p>
                            <p className="text-2xl font-bold mt-2">
                                {reportData?.totalAppointments?.toLocaleString() || 0}
                            </p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">+12%</span>
                            </div>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                            <p className="text-2xl font-bold mt-2">
                                {formatCurrency(reportData?.totalRevenue || 0)}
                            </p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">+18%</span>
                            </div>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Người dùng mới</p>
                            <p className="text-2xl font-bold mt-2">
                                {reportData?.newUsers?.toLocaleString() || 0}
                            </p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">+5%</span>
                            </div>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tỷ lệ hoàn thành</p>
                            <p className="text-2xl font-bold mt-2">
                                {reportData?.completedAppointments && reportData?.totalAppointments
                                    ? Math.round((reportData.completedAppointments / reportData.totalAppointments) * 100)
                                    : 0}%
                            </p>
                            <div className="flex items-center mt-2">
                                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                                <span className="text-sm text-red-600">-2%</span>
                            </div>
                        </div>
                        <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <BarChart3 className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and detailed reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue chart */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h2>
                    <div className="space-y-4">
                        {reportData?.revenueByMonth?.map((item: any, index: number) => (
                            <div key={index} className="flex items-center">
                                <div className="w-16 text-sm font-medium">{item.month}</div>
                                <div className="flex-1 ml-4">
                                    <div className="h-8 bg-blue-100 rounded overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded"
                                            style={{
                                                width: `${(item.revenue / 30000000) * 100}%`,
                                                maxWidth: '100%'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="w-24 text-right font-medium">
                                    {formatCurrency(item.revenue)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top doctors */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-lg font-semibold mb-4">Bác sĩ hàng đầu</h2>
                    <div className="space-y-4">
                        {reportData?.topDoctors?.map((doctor: any, index: number) => (
                            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="font-semibold">{index + 1}</span>
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="font-medium">{doctor.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {doctor.appointments} cuộc hẹn • {formatCurrency(doctor.revenue)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-blue-600">
                                        {formatCurrency(doctor.revenue / doctor.appointments || 0)}/cuộc hẹn
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Appointment stats */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">Thống kê cuộc hẹn</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-3xl font-bold text-green-600">
                            {reportData?.completedAppointments || 0}
                        </p>
                        <p className="text-sm text-green-800 mt-2">Đã hoàn thành</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-3xl font-bold text-yellow-600">
                            {reportData?.pendingAppointments || 0}
                        </p>
                        <p className="text-sm text-yellow-800 mt-2">Đang chờ</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-3xl font-bold text-red-600">
                            {reportData?.cancelledAppointments || 0}
                        </p>
                        <p className="text-sm text-red-800 mt-2">Đã hủy</p>
                    </div>
                </div>
            </div>
        </div>
    );
}