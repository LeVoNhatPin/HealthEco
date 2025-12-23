'use client';

import { useState, Fragment } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  User,
  Users,
  Calendar,
  Stethoscope,
  Building2,
  FileText,
  Settings,
  Bell,
  BarChart3,
  Shield,
  X,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';

interface DashboardSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navigationItems = {
  Patient: [
    { name: 'Tổng quan', href: '/patient', icon: Home },
    { name: 'Đặt lịch', href: '/patient/appointments', icon: Calendar },
    { name: 'Lịch sử', href: '/patient/history', icon: FileText },
    { name: 'Hồ sơ', href: '/patient/profile', icon: User },
    { name: 'Thông báo', href: '/patient/notifications', icon: Bell },
  ],
  Doctor: [
    { name: 'Tổng quan', href: '/doctor', icon: Home },
    { name: 'Lịch làm việc', href: '/doctor/schedule', icon: Calendar },
    { name: 'Bệnh nhân', href: '/doctor/patients', icon: Users },
    { name: 'Cuộc hẹn', href: '/doctor/appointments', icon: Stethoscope },
    { name: 'Hồ sơ', href: '/doctor/profile', icon: User },
    { name: 'Thông báo', href: '/doctor/notifications', icon: Bell },
  ],
  ClinicAdmin: [
    { name: 'Tổng quan', href: '/clinic', icon: Home },
    { name: 'Bác sĩ', href: '/clinic/doctors', icon: Users },
    { name: 'Cuộc hẹn', href: '/clinic/appointments', icon: Calendar },
    { name: 'Phòng khám', href: '/clinic/management', icon: Building2 },
    { name: 'Thống kê', href: '/clinic/statistics', icon: BarChart3 },
    { name: 'Hồ sơ', href: '/clinic/profile', icon: User },
  ],
  SystemAdmin: [
    { name: 'Tổng quan', href: '/admin', icon: Home },
    { name: 'Người dùng', href: '/admin/users', icon: Users },
    { name: 'Bác sĩ', href: '/admin/doctors', icon: Stethoscope },
    { name: 'Phòng khám', href: '/admin/clinics', icon: Building2 },
    { name: 'Báo cáo', href: '/admin/reports', icon: BarChart3 },
    { name: 'Hệ thống', href: '/admin/system', icon: Settings },
    { name: 'Hồ sơ', href: '/admin/profile', icon: User },
  ],
};

export default function DashboardSidebar({ sidebarOpen, setSidebarOpen }: DashboardSidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const role = user?.role || 'Patient';
  const items = navigationItems[role as keyof typeof navigationItems] || [];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo and close button */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-900">HealthEco</span>
          </div>
          <button
            type="button"
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User profile */}
        <div className="px-4 py-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <User className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/patient' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t px-4 py-4">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            Đăng xuất
          </button>
        </div>
      </div>
    </>
  );
}