// frontend/src/app/admin/bac-si/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/admin.service';
import { Doctor } from '@/types/admin';
import {
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    XCircle,
    Edit,
    ChevronLeft,
    ChevronRight,
    Eye
} from 'lucide-react';
import Link from 'next/link';

export default function DoctorsManagementPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [verificationFilter, setVerificationFilter] = useState('all'); // 'all', 'verified', 'pending'
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        loadDoctors();
    }, [currentPage, searchTerm, verificationFilter]);

    const loadDoctors = async () => {
        try {
            setLoading(true);
            const params: any = {
                page: currentPage,
                pageSize: 10,
                search: searchTerm || undefined
            };

            if (verificationFilter !== 'all') {
                params.isVerified = verificationFilter === 'verified';
            }

            const response = await adminService.getDoctors(params);

            if (response.success) {
                setDoctors(response.data.doctors || response.data || []);
                setTotalPages(response.data.pagination?.totalPages || 1);
                setTotalCount(response.data.pagination?.totalCount || response.data.length || 0);
            }
        } catch (error) {
            console.error('Error loading doctors:', error);
            // Nếu API chưa có, tạm thời dùng mock data
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationToggle = async (doctorId: number, currentVerified: boolean) => {
        if (confirm(`Bạn có chắc muốn ${currentVerified ? 'hủy xác minh' : 'xác minh'} bác sĩ này?`)) {
            try {
                await adminService.verifyDoctor(doctorId, !currentVerified);
                loadDoctors();
            } catch (error) {
                console.error('Error updating doctor verification:', error);
                alert('Có lỗi xảy ra khi cập nhật trạng thái xác minh');
            }
        }
    };

    const getVerificationBadge = (isVerified: boolean) => {
        if (isVerified) {
            return (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Đã xác minh
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                Chờ xác minh
            </span>
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Bác sĩ</h1>
                <p className="text-gray-600">Quản lý danh sách bác sĩ trong hệ thống</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, email, số giấy phép..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-48">
                        <select
                            value={verificationFilter}
                            onChange={(e) => setVerificationFilter(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="verified">Đã xác minh</option>
                            <option value="pending">Chờ xác minh</option>
                        </select>
                    </div>
                    <button
                        onClick={loadDoctors}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Tìm kiếm
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng số bác sĩ</p>
                            <p className="text-2xl font-bold mt-2">{totalCount}</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xl">👨‍⚕️</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Đã xác minh</p>
                            <p className="text-2xl font-bold mt-2">
                                {doctors.filter(d => d.isVerified).length}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Chờ xác minh</p>
                            <p className="text-2xl font-bold mt-2">
                                {doctors.filter(d => !d.isVerified).length}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <XCircle className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Doctors table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Đang tải...</p>
                    </div>
                ) : doctors.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-600">Không tìm thấy bác sĩ nào</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bác sĩ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thông tin
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {doctors.map((doctor) => (
                                        <tr key={doctor.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {doctor.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{doctor.user?.fullName}</p>
                                                    <p className="text-sm text-gray-500">{doctor.user?.email}</p>
                                                    <p className="text-sm text-gray-500">{doctor.user?.phoneNumber}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm">
                                                        <span className="font-medium">Giấy phép:</span> {doctor.medicalLicense}
                                                    </p>
                                                    <p className="text-sm">
                                                        <span className="font-medium">Phí tư vấn:</span> {formatCurrency(doctor.consultationFee)}
                                                    </p>
                                                    <p className="text-sm">
                                                        <span className="font-medium">Đánh giá:</span> ⭐ {doctor.rating} ({doctor.totalReviews} đánh giá)
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getVerificationBadge(doctor.isVerified)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleVerificationToggle(doctor.id, doctor.isVerified)}
                                                        className={`px-3 py-1 text-sm rounded ${doctor.isVerified
                                                                ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                                                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                            }`}
                                                    >
                                                        {doctor.isVerified ? 'Hủy xác minh' : 'Xác minh'}
                                                    </button>
                                                    <Link
                                                        href={`/bac-si/${doctor.id}`}
                                                        target="_blank"
                                                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                                                    >
                                                        <Eye className="h-4 w-4 inline-block" />
                                                    </Link>
                                                    <button className="px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100">
                                                        <Edit className="h-4 w-4 inline-block" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Hiển thị {doctors.length} trên tổng số {totalCount} bác sĩ
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <span className="px-3 py-1 text-sm">
                                        Trang {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}