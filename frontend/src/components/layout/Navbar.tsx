// frontend/src/components/layout/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Settings, Calendar, Menu, X, Stethoscope, Building, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const { user, logout, isAuthenticated, getRedirectPath } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            router.push('/dang-nhap');
        } catch (error) {
            console.error('Đăng xuất thất bại:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Hàm lấy icon theo role
    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'Doctor':
                return <Stethoscope className="h-4 w-4 mr-2" />;
            case 'ClinicAdmin':
                return <Building className="h-4 w-4 mr-2" />;
            case 'SystemAdmin':
                return <Shield className="h-4 w-4 mr-2" />;
            default:
                return <User className="h-4 w-4 mr-2" />;
        }
    };

    // Hàm lấy label cho dashboard theo role
    const getDashboardLabel = (role: string) => {
        switch (role) {
            case 'Doctor':
                return 'Dashboard Bác sĩ';
            case 'ClinicAdmin':
                return 'Dashboard Phòng khám';
            case 'SystemAdmin':
                return 'Dashboard Admin';
            default:
                return 'Bảng điều khiển';
        }
    };

    // Hàm lấy màu badge theo role
    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'Doctor':
                return 'bg-blue-100 text-blue-800';
            case 'ClinicAdmin':
                return 'bg-purple-100 text-purple-800';
            case 'SystemAdmin':
                return 'bg-red-100 text-red-800';
            case 'Patient':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Hàm lấy tên role hiển thị
    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case 'Doctor':
                return 'Bác sĩ';
            case 'ClinicAdmin':
                return 'Quản lý phòng khám';
            case 'SystemAdmin':
                return 'Quản trị viên';
            case 'Patient':
                return 'Bệnh nhân';
            default:
                return role;
        }
    };

    // Lấy đường dẫn dashboard dựa trên role
    const getDashboardPath = () => {
        if (!user) return '/bang-dieu-khien';
        return getRedirectPath(user);
    };

    // Kiểm tra xem có phải là Doctor không để hiển thị menu đặc biệt
    const isDoctor = user?.role === 'Doctor';

    return (
        <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                            <span className="text-xl font-bold text-gray-900">HealthEco</span>
                        </Link>

                        <div className="hidden md:flex items-center ml-10 space-x-6">
                            {isAuthenticated && isDoctor ? (
                                <>
                                    {/* Menu đặc biệt cho bác sĩ */}
                                    <Link href="/bac-si/bang-dieu-khien" className="text-gray-700 hover:text-blue-600 transition-colors">
                                        Dashboard
                                    </Link>
                                    <Link href="/bac-si/lich-hen" className="text-gray-700 hover:text-blue-600 transition-colors">
                                        Lịch hẹn
                                    </Link>
                                    <Link href="/bac-si/benh-nhan" className="text-gray-700 hover:text-blue-600 transition-colors">
                                        Bệnh nhân
                                    </Link>
                                    <Link href="/bac-si/lich-trinh" className="text-gray-700 hover:text-blue-600 transition-colors">
                                        Lịch trình
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {/* Menu chung cho tất cả */}
                                    <Link href="/bac-si" className="text-gray-700 hover:text-blue-600 transition-colors">
                                        Bác sĩ
                                    </Link>
                                    <Link href="/phong-kham" className="text-gray-700 hover:text-blue-600 transition-colors">
                                        Phòng khám
                                    </Link>
                                    <Link href="/dat-lich" className="text-gray-700 hover:text-blue-600 transition-colors">
                                        Đặt lịch
                                    </Link>
                                    <Link href="/ve-chung-toi" className="text-gray-700 hover:text-blue-600 transition-colors">
                                        Về chúng tôi
                                    </Link>
                                    <Link href="/lien-he" className="text-gray-700 hover:text-blue-600 transition-colors">
                                        Liên hệ
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {isAuthenticated ? (
                            <>
                                {/* Dashboard button với icon và label theo role */}
                                <Button variant="outline" className="hidden md:inline-flex">
                                    <Link href={getDashboardPath()} className="flex items-center">
                                        {getRoleIcon(user?.role || '')}
                                        {getDashboardLabel(user?.role || '')}
                                    </Link>
                                </Button>

                                <div className="flex items-center space-x-2">
                                    {/* Hiển thị badge role */}
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user?.role || '')}`}>
                                        {getRoleDisplayName(user?.role || '')}
                                    </span>

                                    {/* Avatar và user info */}
                                    <div className="flex items-center space-x-2">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                                {user?.fullName?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="hidden md:block text-left">
                                            <p className="text-sm font-medium">{user?.fullName}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                    </div>

                                    {/* Profile link */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="hidden md:inline-flex"
                                    >
                                        <Link href="/bang-dieu-khien/profile">
                                            <Settings className="h-4 w-4" />
                                        </Link>
                                    </Button>

                                    {/* Logout button */}
                                    <Button
                                        variant="ghost"
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        size="sm"
                                    >
                                        {isLoggingOut ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang đăng xuất
                                            </span>
                                        ) : (
                                            <LogOut className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" className="hidden md:inline-flex">
                                    <Link href="/dang-nhap">Đăng nhập</Link>
                                </Button>
                                <Button>
                                    <Link href="/dang-ky">Đăng ký</Link>
                                </Button>
                            </>
                        )}

                        <button
                            className="md:hidden p-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={cn(
                    "md:hidden transition-all duration-300 overflow-hidden",
                    isMenuOpen ? "max-h-96 py-4" : "max-h-0"
                )}>
                    <div className="flex flex-col space-y-3 border-t pt-4">
                        {isAuthenticated ? (
                            <>
                                {/* User info in mobile */}
                                <div className="flex items-center space-x-3 pb-4 border-b">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600">
                                            {user?.fullName?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{user?.fullName}</p>
                                        <p className="text-sm text-gray-500">{user?.email}</p>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full mt-1 ${getRoleBadgeColor(user?.role || '')}`}>
                                            {getRoleDisplayName(user?.role || '')}
                                        </span>
                                    </div>
                                </div>

                                {/* Dashboard link */}
                                <Link
                                    href={getDashboardPath()}
                                    className="flex items-center text-gray-700 hover:text-blue-600 py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {getDashboardLabel(user?.role || '')}
                                </Link>

                                {/* Menu cho bác sĩ */}
                                {isDoctor && (
                                    <>
                                        <Link
                                            href="/bac-si/lich-hen"
                                            className="text-gray-700 hover:text-blue-600 py-2"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Lịch hẹn
                                        </Link>
                                        <Link
                                            href="/bac-si/benh-nhan"
                                            className="text-gray-700 hover:text-blue-600 py-2"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Bệnh nhân
                                        </Link>
                                        <Link
                                            href="/bac-si/lich-trinh"
                                            className="text-gray-700 hover:text-blue-600 py-2"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Lịch trình
                                        </Link>
                                    </>
                                )}

                                {/* Common links for all */}
                                <Link
                                    href="/bac-si"
                                    className="text-gray-700 hover:text-blue-600 py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Bác sĩ
                                </Link>
                                <Link
                                    href="/phong-kham"
                                    className="text-gray-700 hover:text-blue-600 py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Phòng khám
                                </Link>
                                <Link
                                    href="/dat-lich"
                                    className="text-gray-700 hover:text-blue-600 py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Đặt lịch
                                </Link>

                                {/* Profile */}
                                <Link
                                    href="/bang-dieu-khien/profile"
                                    className="text-gray-700 hover:text-blue-600 py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Hồ sơ cá nhân
                                </Link>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="text-left text-red-600 hover:text-red-800 py-2"
                                    disabled={isLoggingOut}
                                >
                                    {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/bac-si"
                                    className="text-gray-700 hover:text-blue-600 py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Bác sĩ
                                </Link>
                                <Link
                                    href="/phong-kham"
                                    className="text-gray-700 hover:text-blue-600 py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Phòng khám
                                </Link>
                                <Link
                                    href="/dat-lich"
                                    className="text-gray-700 hover:text-blue-600 py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Đặt lịch
                                </Link>
                                <Link
                                    href="/ve-chung-toi"
                                    className="text-gray-700 hover:text-blue-600 py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Về chúng tôi
                                </Link>
                                <Link
                                    href="/lien-he"
                                    className="text-gray-700 hover:text-blue-600 py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Liên hệ
                                </Link>

                                <Link
                                    href="/dang-nhap"
                                    className="py-2 text-blue-600 font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/dang-ky"
                                    className="py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}