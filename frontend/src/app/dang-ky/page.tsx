// frontend/src/app/dang-ky/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegistrationPage() {
    const { user } = useAuth();
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const registrationOptions = [
        {
            role: 'patient',
            title: 'Đăng ký Bệnh nhân',
            description: 'Tạo tài khoản để đặt lịch khám, quản lý hồ sơ sức khỏe',
            icon: '👤',
            link: '/dang-ky/benh-nhan',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            role: 'doctor',
            title: 'Đăng ký Bác sĩ',
            description: 'Đăng ký tài khoản bác sĩ để cung cấp dịch vụ tư vấn',
            icon: '👨‍⚕️',
            link: '/dang-ky/bac-si',
            color: 'from-green-500 to-emerald-500'
        },
        {
            role: 'clinic',
            title: 'Đăng ký Phòng khám',
            description: 'Đăng ký phòng khám/bệnh viện để quản lý và phát triển',
            icon: '🏥',
            link: '/dang-ky/phong-kham',
            color: 'from-purple-500 to-pink-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Chọn Loại Tài Khoản</h1>
                    <p className="text-lg text-gray-600">Chọn loại tài khoản phù hợp với nhu cầu của bạn</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {registrationOptions.map((option) => (
                        <Link
                            key={option.role}
                            href={option.link}
                            className="relative group"
                            onClick={() => setSelectedRole(option.role)}
                        >
                            <div className={`bg-gradient-to-br ${option.color} rounded-2xl p-1 transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl`}>
                                <div className="bg-white rounded-xl p-8 h-full">
                                    <div className="text-center">
                                        <div className="text-6xl mb-6">{option.icon}</div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{option.title}</h3>
                                        <p className="text-gray-600 mb-8">{option.description}</p>

                                        <div className="flex items-center justify-center">
                                            <span className="text-lg font-medium text-gray-900 mr-2">Chọn tài khoản này</span>
                                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Additional info for doctors */}
                {user?.role === 'Doctor' && (
                    <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl text-blue-600">💡</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-blue-900">Bạn là bác sĩ?</h3>
                                <p className="text-blue-700 mt-1">
                                    Đăng ký phòng khám để quản lý lịch làm việc, bác sĩ và cuộc hẹn một cách chuyên nghiệp.
                                    <Link href="/dang-ky/phong-kham" className="ml-2 font-semibold text-blue-600 hover:text-blue-800">
                                        Đăng ký ngay →
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Already have account */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600">
                        Đã có tài khoản?{' '}
                        <Link href="/dang-nhap" className="font-semibold text-blue-600 hover:text-blue-800">
                            Đăng nhập ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}