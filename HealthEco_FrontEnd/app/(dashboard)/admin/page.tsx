'use client';

import { useState, useEffect } from 'react';
import { userService, AdminDashboardStats } from '@/services/userService';
import { 
  Users, Stethoscope, Building2, Calendar, 
  DollarSign, TrendingUp, Activity, Shield,
  UserPlus, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const data = await userService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Tổng người dùng',
      value: stats?.totalUsers || 0,
      icon: Users,
      change: '+12%',
      changeType: 'increase',
      color: 'bg-blue-500',
      href: '/dashboard/admin/users',
    },
    {
      name: 'Bác sĩ',
      value: stats?.totalDoctors || 0,
      icon: Stethoscope,
      change: '+5%',
      changeType: 'increase',
      color: 'bg-green-500',
      href: '/dashboard/admin/doctors',
    },
    {
      name: 'Phòng khám',
      value: stats?.totalClinics || 0,
      icon: Building2,
      change: '+3%',
      changeType: 'increase',
      color: 'bg-purple-500',
      href: '/dashboard/admin/clinics',
    },
    {
      name: 'Cuộc hẹn hôm nay',
      value: stats?.todayAppointments || 0,
      icon: Calendar,
      change: '+18%',
      changeType: 'increase',
      color: 'bg-yellow-500',
      href: '/dashboard/admin/appointments',
    },
    {
      name: 'Doanh thu tháng',
      value: `$${(stats?.revenueThisMonth || 0).toLocaleString()}`,
      icon: DollarSign,
      change: '+24%',
      changeType: 'increase',
      color: 'bg-emerald-500',
      href: '/dashboard/admin/reports',
    },
    {
      name: 'Chờ phê duyệt',
      value: stats?.pendingApprovals || 0,
      icon: Shield,
      change: '-2%',
      changeType: 'decrease',
      color: 'bg-red-500',
      href: '/dashboard/admin/approvals',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h1>
        <p className="mt-1 text-sm text-gray-600">
          Chào mừng quay trở lại! Đây là tổng quan về hệ thống HealthEco.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              href={stat.href}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                  <div className="mt-2 flex items-center">
                    {stat.changeType === 'increase' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`ml-1 text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">so với tháng trước</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hành động nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/dashboard/admin/users/new"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserPlus className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Thêm người dùng</p>
              <p className="text-sm text-gray-500">Tạo tài khoản mới</p>
            </div>
          </Link>
          
          <Link
            href="/dashboard/admin/doctors/approve"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Shield className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Phê duyệt</p>
              <p className="text-sm text-gray-500">Duyệt bác sĩ mới</p>
            </div>
          </Link>
          
          <Link
            href="/dashboard/admin/reports"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Báo cáo</p>
              <p className="text-sm text-gray-500">Xem báo cáo hệ thống</p>
            </div>
          </Link>
          
          <Link
            href="/dashboard/admin/system"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Activity className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Hệ thống</p>
              <p className="text-sm text-gray-500">Cài đặt hệ thống</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity and Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Người dùng mới</h2>
            <Link href="/dashboard/admin/users" className="text-sm text-blue-600 hover:text-blue-500">
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Người dùng {i}</p>
                    <p className="text-sm text-gray-500">user{i}@example.com</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2 giờ trước</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Trạng thái hệ thống</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">API Server</p>
                  <p className="text-sm text-gray-500">Backend service</p>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Hoạt động
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Database</p>
                  <p className="text-sm text-gray-500">PostgreSQL</p>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Hoạt động
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Authentication</p>
                  <p className="text-sm text-gray-500">JWT Service</p>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Hoạt động
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}