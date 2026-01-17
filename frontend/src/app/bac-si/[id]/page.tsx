// app/bac-si/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doctorService } from '@/services/doctor.service';
import { Doctor } from '@/types/doctor';

export default function DoctorDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDoctor();
    }, [id]);

    const loadDoctor = async () => {
        setLoading(true);
        try {
            const response = await doctorService.getDoctor(parseInt(id));
            if (response.success) {
                setDoctor(response.data);
            }
        } catch (error) {
            console.error('Failed to load doctor', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Đang tải thông tin bác sĩ...</p>
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-2xl text-gray-600">Không tìm thấy bác sĩ</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-8 text-white">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                                    <span className="text-4xl">👨‍⚕️</span>
                                </div>
                                <div className="ml-6">
                                    <h1 className="text-3xl font-bold">{doctor.user.fullName}</h1>
                                    <p className="text-xl mt-2">{doctor.specialization?.name}</p>
                                    <div className="flex items-center mt-2">
                                        <span className="text-yellow-300">★★★★★</span>
                                        <span className="ml-2">({doctor.rating} • {doctor.totalReviews} đánh giá)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 md:mt-0 text-center md:text-right">
                                <div className="text-4xl font-bold">{doctor.consultationFee.toLocaleString()} VND</div>
                                <div className="text-lg">/ lượt tư vấn</div>
                                <button className="mt-4 px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100">
                                    Đặt lịch ngay
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left column */}
                            <div className="lg:col-span-2">
                                {/* About */}
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Giới thiệu</h2>
                                    <div className="prose max-w-none">
                                        <p className="text-gray-700 whitespace-pre-line">{doctor.bio || 'Chưa có thông tin giới thiệu.'}</p>
                                    </div>
                                </div>

                                {/* Qualifications */}
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Bằng cấp & Chứng chỉ</h2>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <p className="text-gray-700 whitespace-pre-line">{doctor.qualifications}</p>
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Kinh nghiệm</h2>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-2xl text-blue-500">📅</span>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-xl font-semibold">{doctor.yearsExperience} năm kinh nghiệm</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right column */}
                            <div>
                                {/* Doctor info card */}
                                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin liên hệ</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-500">📧</span>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">{doctor.user.email}</p>
                                            </div>
                                        </div>
                                        {doctor.user.phoneNumber && (
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-500">📱</span>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-gray-500">Điện thoại</p>
                                                    <p className="font-medium">{doctor.user.phoneNumber}</p>
                                                </div>
                                            </div>
                                        )}
                                        {doctor.user.city && (
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-500">📍</span>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-gray-500">Địa điểm</p>
                                                    <p className="font-medium">{doctor.user.city}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* License info */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Giấy phép hành nghề</h3>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-green-500">📜</span>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-gray-500">Số giấy phép</p>
                                            <p className="font-medium">{doctor.medicalLicense}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-green-500">✅</span>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-gray-500">Trạng thái xác minh</p>
                                            <p className="font-medium">{doctor.isVerified ? 'Đã xác minh' : 'Chờ xác minh'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}