// frontend/src/app/admin/layout.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    UserCheck,
    Stethoscope,
    Building,
    Calendar,
    Shield,
    Settings,
    Bell,
    Search,
    Menu,
    X,
    LogOut,
    FileText,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Nếu không phải admin, redirect
    if (!isAdmin()) {
        router.push('/dang-nhap');
        return null;
    }

    const navItems = [
        {
            title: 'Dashboard',
            href: '/admin/bang-dieu-khien',
            icon: LayoutDashboard,
            roles: ['SystemAdmin', 'ClinicAdmin']
        },
        {
            title: 'Người dùng',
            href: '/admin/nguoi-dung',
            icon: Users,
            roles: ['SystemAdmin']
        },
        {
            title: 'Bác sĩ',
            href: '/admin/bac-si',
            icon: Stethoscope,
            roles: ['SystemAdmin', 'ClinicAdmin']
        },
        {
            title: 'Phòng khám',
            href: '/admin/phong-kham',
            icon: Building,
            roles: ['SystemAdmin']
        },
        {
            title: 'Xác minh',
            href: '/admin/xac-minh',
            icon: UserCheck,
            roles: ['SystemAdmin']
        },
        {
            title: 'Báo cáo',
            href: '/admin/bao-cao',
            icon: FileText,
            roles: ['SystemAdmin', 'ClinicAdmin']
        },
        {
            title: 'Sự cố',
            href: '/admin/su-co',
            icon: AlertTriangle,
            roles: ['SystemAdmin', 'ClinicAdmin']
        },
        {
            title: 'Cài đặt',
            href: '/admin/cai-dat',
            icon: Settings,
            roles: ['SystemAdmin', 'ClinicAdmin']
        },
    ];

    const filteredNavItems = navItems.filter(item =>
        item.roles.includes(user?.role || '')
    );

    const handleLogout = async () => {
        await logout();
        router.push('/dang-nhap');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 flex w-full max-w-xs">
                    <div className="relative flex w-full flex-col bg-white">
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center">
                                <Shield className="h-8 w-8 text-blue-600" />
                                <span className="ml-2 text-xl font-bold">Admin Panel</span>
                            </div>
                            <button onClick={() => setSidebarOpen(false)}>
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <nav className="flex-1 space-y-1 p-4">
                            {filteredNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center px-4 py-3 rounded-lg ${isActive
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <Icon className="h-5 w-5 mr-3" />
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-1 bg-white border-r">
                    <div className="flex items-center h-16 px-4 border-b">
                        <Shield className="h-8 w-8 text-blue-600" />
                        <span className="ml-2 text-xl font-bold">Admin Panel</span>
                    </div>
                    <nav className="flex-1 p-4 space-y-1">
                        {filteredNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 rounded-lg ${isActive
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="h-5 w-5 mr-3" />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="p-4 border-t">
                        <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="font-semibold text-blue-600">
                                    {user?.fullName?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium">{user?.fullName}</p>
                                <p className="text-xs text-gray-500">
                                    {user?.role === 'SystemAdmin' ? 'Quản trị viên' : 'Quản lý phòng khám'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full mt-4 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-10 bg-white border-b">
                    <div className="flex items-center justify-between h-16 px-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-md text-gray-600"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <div className="ml-4 lg:ml-0">
                                <h1 className="text-lg font-semibold">
                                    {filteredNavItems.find(item => item.href === pathname)?.title || 'Admin'}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                            </button>
                            <div className="hidden lg:block">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-sm font-semibold text-blue-600">
                                            {user?.fullName?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium">{user?.fullName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}