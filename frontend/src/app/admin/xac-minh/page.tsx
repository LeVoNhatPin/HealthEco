// frontend/src/app/admin/xac-minh/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/admin.service';
import { Doctor } from '@/types/doctor';
import {
    Search,
    CheckCircle,
    XCircle,
    FileText,
    Clock,
    AlertCircle
} from 'lucide-react';

export default function VerificationPage() {
    const [pendingDoctors, setPendingDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [verifyingId, setVerifyingId] = useState<number | null>(null);

    useEffect(() => {
        loadPendingDoctors();
    }, []);

    const loadPendingDoctors = async () => {
        try {
            setLoading(true);
            const response = await adminService.getPendingVerifications();

            if (response.success) {
                setPendingDoctors(response.data || []);
            } else {
                // Nếu API chưa có, gọi API doctors với filter isVerified = false
                const doctorsResponse = await adminService.getDoctors({ isVerified: false });
                if (doctorsResponse.success) {
                    setPendingDoctors(doctorsResponse.data.doctors || doctorsResponse.data || []);
                }
            }
        } catch (error) {
            console.error('Error loading pending verifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (doctorId: number, approve: boolean) => {
        setVerifyingId(doctorId);
        try {
            await adminService.verifyDoctor(doctorId, approve);
            await loadPendingDoctors();
            alert(`Đã ${approve ? 'xác minh' : 'từ chối'} bác sĩ thành công`);
        } catch (error) {
            console.error('Error updating verification:', error);
            alert('Có lỗi xảy ra khi xử lý yêu cầu');
        } finally {
            setVerifyingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Xác minh Bác sĩ</h1>
                <p className="text-gray-600">Xem xét và xác minh các bác sĩ đăng ký mới</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Chờ xác minh</p>
                            <p className="text-2xl font-bold mt-2">{pendingDoctors.length}</p>
                        </div>
                        <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Đã xác minh</p>
                            <p className="text-2xl font-bold mt-2">0</p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Từ chối</p>
                            <p className="text-2xl font-bold mt-2">0</p>
                        </div>
                        <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng đơn</p>
                            <p className="text-2xl font-bold mt-2">{pendingDoctors.length}</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification list */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Đang tải danh sách chờ xác minh...</p>
                    </div>
                ) : pendingDoctors.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="inline-block p-4 bg-green-50 rounded-full">
                            <CheckCircle className="h-12 w-12 text-green-500" />
                        </div>
                        <p className="mt-4 text-gray-600">Không có bác sĩ nào chờ xác minh</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {pendingDoctors.map((doctor) => (
                            <div key={doctor.id} className="p-6 hover:bg-gray-50">
                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-start">
                                            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-lg">👨‍⚕️</span>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {doctor.user?.fullName}
                                                </h3>
                                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">Email:</span> {doctor.user?.email}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">Điện thoại:</span> {doctor.user?.phoneNumber}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">Giấy phép:</span> {doctor.medicalLicense}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">Ngày đăng ký:</span> {formatDate(doctor.createdAt)}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">Bằng cấp:</span> {doctor.qualifications?.substring(0, 50)}...
                                                        </p>
                                                        {doctor.licenseImageUrl && (
                                                            <a
                                                                href={doctor.licenseImageUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-blue-600 hover:underline"
                                                            >
                                                                Xem giấy phép
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex space-x-3">
                                        <button
                                            onClick={() => handleVerification(doctor.id, true)}
                                            disabled={verifyingId === doctor.id}
                                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {verifyingId === doctor.id ? 'Đang xử lý...' : 'Xác minh'}
                                        </button>
                                        <button
                                            onClick={() => handleVerification(doctor.id, false)}
                                            disabled={verifyingId === doctor.id}
                                            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Từ chối
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}