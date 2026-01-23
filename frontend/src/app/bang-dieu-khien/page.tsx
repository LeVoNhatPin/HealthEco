'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Stethoscope, Building, Bell } from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Chào mừng trở lại, {user?.fullName}!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Đây là bảng điều khiển của bạn. Quản lý tất cả thông tin sức khỏe tại đây.
                    </p>
                </div>

                {/* Role-based content */}
                <div className="mb-8">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100">
                        <span className="text-blue-800 font-medium capitalize">
                            Vai trò: {user?.role}
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Lịch hẹn hôm nay</p>
                                    <p className="text-2xl font-bold">0</p>
                                </div>
                                <Calendar className="h-10 w-10 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Lịch hẹn sắp tới</p>
                                    <p className="text-2xl font-bold">0</p>
                                </div>
                                <Clock className="h-10 w-10 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Bác sĩ đã khám</p>
                                    <p className="text-2xl font-bold">0</p>
                                </div>
                                <Stethoscope className="h-10 w-10 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phòng khám đã đến</p>
                                    <p className="text-2xl font-bold">0</p>
                                </div>
                                <Building className="h-10 w-10 text-orange-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hành Động Nhanh</CardTitle>
                            <CardDescription>Thao tác nhanh với tài khoản của bạn</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Link href="/bang-dieu-khien/profile">
                                <Button className="w-full justify-start" variant="outline">
                                    <User className="mr-2 h-4 w-4" />
                                    Xem & Chỉnh sửa Hồ Sơ
                                </Button>
                            </Link>
                            <Link href="/bang-dieu-khien/lich-hen">
                                <Button className="w-full justify-start" variant="outline">
                                    <User className="mr-2 h-4 w-4" />
                                    Lịch hẹn
                                </Button>
                            </Link>
                            <Link href="/dat-lich">
                                <Button className="w-full justify-start" variant="outline">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Đặt Lịch Khám Mới
                                </Button>
                            </Link>

                            <Link href="/bac-si">
                                <Button className="w-full justify-start" variant="outline">
                                    <Stethoscope className="mr-2 h-4 w-4" />
                                    Tìm Bác Sĩ
                                </Button>
                            </Link>

                            <Link href="/phong-kham">
                                <Button className="w-full justify-start" variant="outline">
                                    <Building className="mr-2 h-4 w-4" />
                                    Tìm Phòng Khám
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Thông Báo</CardTitle>
                            <CardDescription>Cập nhật mới nhất</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Chào mừng đến với HealthEco!</p>
                                        <p className="text-sm text-gray-600">Cảm ơn bạn đã đăng ký tài khoản.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Bell className="h-5 w-5 text-green-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Cập nhật hồ sơ của bạn</p>
                                        <p className="text-sm text-gray-600">Hãy hoàn thiện thông tin cá nhân để sử dụng đầy đủ tính năng.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Role-specific features */}
                {user?.role === 'SystemAdmin' && (
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Quản Trị Hệ Thống</CardTitle>
                            <CardDescription>Công cụ dành cho quản trị viên</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Link href="/admin">
                                    <Button className="w-full">Truy cập Admin Dashboard</Button>
                                </Link>
                                <p className="text-sm text-gray-600">
                                    Với vai trò System Admin, bạn có quyền quản lý toàn bộ hệ thống.
                                </p>
                            </div>
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