// frontend/src/app/phong-kham/bang-dieu-khien/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { clinicService } from '@/services/clinic.service';
import { MedicalFacility } from '@/types/clinic';
import Link from 'next/link';

export default function ClinicDashboardPage() {
    const [myClinics, setMyClinics] = useState<MedicalFacility[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        loadMyClinics();
    }, []);

    const loadMyClinics = async () => {
        setLoading(true);
        try {
            const response = await clinicService.getMyClinics();
            if (response.success) {
                setMyClinics(response.data);
            }
        } catch (error) {
            console.error('Failed to load my clinics:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFacilityTypeName = (type: string) => {
        switch (type) {
            case 'HOSPITAL': return 'Bệnh viện';
            case 'CLINIC': return 'Phòng khám';
            case 'HOME_CLINIC': return 'Phòng khám tại nhà';
            default: return type;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý Cơ sở Y tế</h1>
                    <p className="text-gray-600 mt-2">Quản lý tất cả cơ sở y tế của bạn</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng cơ sở</p>
                                <p className="text-2xl font-bold mt-2">{myClinics.length}</p>
                            </div>
                            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xl">🏥</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Đã xác minh</p>
                                <p className="text-2xl font-bold mt-2">
                                    {myClinics.filter(c => c.isVerified).length}
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-xl">✅</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Chờ xác minh</p>
                                <p className="text-2xl font-bold mt-2">
                                    {myClinics.filter(c => !c.isVerified).length}
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-xl">⏳</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng đánh giá</p>
                                <p className="text-2xl font-bold mt-2">
                                    {myClinics.reduce((sum, clinic) => sum + clinic.totalReviews, 0)}
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-xl">⭐</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mb-8 flex justify-between items-center">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-2 rounded-lg ${activeTab === 'overview' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}
                        >
                            Tổng quan
                        </button>
                        <button
                            onClick={() => setActiveTab('clinics')}
                            className={`px-4 py-2 rounded-lg ${activeTab === 'clinics' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}
                        >
                            Danh sách cơ sở
                        </button>
                    </div>

                    <Link
                        href="/dang-ky/phong-kham"
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                    >
                        <span className="mr-2">+</span>
                        Thêm cơ sở mới
                    </Link>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'overview' && (
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Tổng quan cơ sở y tế</h2>
                        {myClinics.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="inline-block p-6 bg-gray-100 rounded-full">
                                    <span className="text-4xl">🏥</span>
                                </div>
                                <p className="mt-4 text-gray-600">Bạn chưa có cơ sở y tế nào</p>
                                <Link
                                    href="/dang-ky/phong-kham"
                                    className="mt-4 inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Đăng ký cơ sở đầu tiên
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {myClinics.map((clinic) => (
                                    <div key={clinic.id} className="border rounded-xl p-6 hover:shadow-lg transition-shadow">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start">
                                                {clinic.avatarUrl ? (
                                                    <img
                                                        src={clinic.avatarUrl}
                                                        alt={clinic.name}
                                                        className="w-16 h-16 rounded-full border-4 border-white shadow"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-full border-4 border-white shadow bg-blue-100 flex items-center justify-center">
                                                        <span className="text-2xl">🏥</span>
                                                    </div>
                                                )}
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-bold text-gray-900">{clinic.name}</h3>
                                                    <div className="flex items-center mt-1">
                                                        <span className="text-yellow-400">★★★★★</span>
                                                        <span className="ml-2 text-gray-600">
                                                            {clinic.rating.toFixed(1)} ({clinic.totalReviews})
                                                        </span>
                                                        <span className={`ml-3 px-2 py-1 rounded-full text-xs ${clinic.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {clinic.isVerified ? 'Đã xác minh' : 'Chờ xác minh'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center mt-2 text-sm text-gray-600">
                                                        <span>{getFacilityTypeName(clinic.facilityType)}</span>
                                                        <span className="mx-2">•</span>
                                                        <span>{clinic.city}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-blue-600">{clinic.totalDoctors || 0}</div>
                                                <div className="text-sm text-gray-500">bác sĩ</div>
                                            </div>
                                        </div>

                                        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-2xl font-bold text-gray-900">{clinic.totalAppointments || 0}</div>
                                                <div className="text-sm text-gray-600">cuộc hẹn</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-2xl font-bold text-gray-900">{clinic.totalReviews}</div>
                                                <div className="text-sm text-gray-600">đánh giá</div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex space-x-3">
                                            <Link
                                                href={`/phong-kham/${clinic.id}`}
                                                className="flex-1 px-4 py-2 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600"
                                            >
                                                Xem chi tiết
                                            </Link>
                                            <Link
                                                href={`/phong-kham/bang-dieu-khien/${clinic.id}`}
                                                className="flex-1 px-4 py-2 border border-blue-500 text-blue-500 text-center rounded-lg hover:bg-blue-50"
                                            >
                                                Quản lý
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'clinics' && (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Danh sách cơ sở y tế</h2>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm cơ sở..."
                                        className="px-4 py-2 border rounded-lg"
                                    />
                                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                                        Lọc
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tên cơ sở
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Loại
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Địa điểm
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bác sĩ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {myClinics.map((clinic) => (
                                        <tr key={clinic.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {clinic.avatarUrl ? (
                                                        <img
                                                            src={clinic.avatarUrl}
                                                            alt={clinic.name}
                                                            className="w-10 h-10 rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span>🏥</span>
                                                        </div>
                                                    )}
                                                    <div className="ml-3">
                                                        <p className="font-medium text-gray-900">{clinic.name}</p>
                                                        <p className="text-sm text-gray-500">{clinic.code}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                                    {getFacilityTypeName(clinic.facilityType)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{clinic.city}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${clinic.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {clinic.isVerified ? 'Đã xác minh' : 'Chờ xác minh'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {clinic.totalDoctors || 0} bác sĩ
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={`/phong-kham/${clinic.id}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Xem
                                                    </Link>
                                                    <Link
                                                        href={`/phong-kham/bang-dieu-khien/${clinic.id}`}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Quản lý
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}