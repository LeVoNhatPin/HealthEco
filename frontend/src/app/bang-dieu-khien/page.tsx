'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, FileText, CreditCard, Star } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = {
    upcomingAppointments: 2,
    pastAppointments: 5,
    prescriptions: 3,
    pendingPayments: 1,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Xin chào, {user?.fullName}!</h1>
        <p className="text-gray-600">Chào mừng trở lại với HealthEco</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lịch hẹn sắp tới</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
            <p className="text-xs text-gray-500">Tiếp theo: Ngày mai, 10:00</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lịch hẹn đã qua</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pastAppointments}</div>
            <p className="text-xs text-gray-500">Gần nhất: 2 ngày trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn thuốc</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.prescriptions}</div>
            <p className="text-xs text-gray-500">Đang hoạt động: 1</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thanh toán chờ xử lý</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-gray-500">Tổng: ₫500,000</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>Các tính năng thường dùng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline"  className="h-auto py-4">
                <Link href="/bac-si">
                  <div className="text-left">
                    <Calendar className="h-5 w-5 mb-2 text-blue-600" />
                    <div className="font-medium">Đặt lịch</div>
                    <p className="text-sm text-gray-500 mt-1">Tìm bác sĩ</p>
                  </div>
                </Link>
              </Button>
              
              <Button variant="outline"  className="h-auto py-4">
                <Link href="/bang-dieu-khien/lich-hen">
                  <div className="text-left">
                    <Calendar className="h-5 w-5 mb-2 text-green-600" />
                    <div className="font-medium">Xem lịch hẹn</div>
                    <p className="text-sm text-gray-500 mt-1">Sắp tới & đã qua</p>
                  </div>
                </Link>
              </Button>
              
              <Button variant="outline"  className="h-auto py-4">
                <Link href="/bang-dieu-khien/ho-so">
                  <div className="text-left">
                    <FileText className="h-5 w-5 mb-2 text-purple-600" />
                    <div className="font-medium">Hồ sơ sức khỏe</div>
                    <p className="text-sm text-gray-500 mt-1">Xem lịch sử</p>
                  </div>
                </Link>
              </Button>
              
              <Button variant="outline"  className="h-auto py-4">
                <Link href="/bang-dieu-khien/cai-dat">
                  <div className="text-left">
                    <User className="h-5 w-5 mb-2 text-orange-600" />
                    <div className="font-medium">Cài đặt</div>
                    <p className="text-sm text-gray-500 mt-1">Thông tin cá nhân</p>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lịch hẹn sắp tới</CardTitle>
            <CardDescription>Cuộc hẹn tiếp theo của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.upcomingAppointments > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium">BS. Nguyễn Văn A</div>
                    <div className="text-sm text-gray-500">Chuyên khoa Tim mạch</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Ngày mai, 10:00</div>
                    <div className="text-sm text-gray-500">30 phút</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full" >
                  <Link href="/bang-dieu-khien/lich-hen">Xem tất cả</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">Không có lịch hẹn sắp tới</h3>
                <p className="text-gray-500 mb-4">Đặt lịch hẹn đầu tiên của bạn với bác sĩ</p>
                <Button >
                  <Link href="/bac-si">Tìm bác sĩ</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}