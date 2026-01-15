'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Settings, Calendar, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
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
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {isAuthenticated ? (
                            <>
                                <Button variant="outline" className="hidden md:inline-flex">
                                    <Link href="/bang-dieu-khien">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Bảng điều khiển
                                    </Link>
                                </Button>

                                <div className="flex items-center space-x-2">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600">
                                            {user?.fullName?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button
                                        variant="ghost"
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                    >
                                        <LogOut className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" className="hidden md:inline-flex">
                                    <Link href="/dang-nhap">Đăng nhập</Link>
                                </Button>
                                <Button >
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
                    isMenuOpen ? "max-h-64 py-4" : "max-h-0"
                )}>
                    <div className="flex flex-col space-y-3 border-t pt-4">
                        <Link href="/bac-si" className="text-gray-700 hover:text-blue-600 py-2">
                            Bác sĩ
                        </Link>
                        <Link href="/phong-kham" className="text-gray-700 hover:text-blue-600 py-2">
                            Phòng khám
                        </Link>
                        <Link href="/dat-lich" className="text-gray-700 hover:text-blue-600 py-2">
                            Đặt lịch
                        </Link>
                        <Link href="/ve-chung-toi" className="text-gray-700 hover:text-blue-600 py-2">
                            Về chúng tôi
                        </Link>
                        <Link href="/lien-he" className="text-gray-700 hover:text-blue-600 py-2">
                            Liên hệ
                        </Link>

                        {!isAuthenticated && (
                            <>
                                <Link href="/dang-nhap" className="py-2">
                                    Đăng nhập
                                </Link>
                                <Link href="/dang-ky" className="py-2">
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