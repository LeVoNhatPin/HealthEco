// frontend/src/app/admin/nguoi-dung/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/admin.service';
import {
    Search,
    Filter,
    MoreVertical,
    UserCheck,
    UserX,
    Edit,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface User {
    id: number;
    email: string;
    fullName: string;
    role: string;
    phoneNumber: string;
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadUsers();
    }, [currentPage, searchTerm, selectedRole]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                pageSize: 10,
                search: searchTerm || undefined,
                role: selectedRole !== 'all' ? selectedRole : undefined
            };

            const response = await adminService.getUsers(params);

            if (response.success) {
                setUsers(response.data.users || []);
                setTotalPages(response.data.pagination?.totalPages || 1);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
        if (confirm(`Bạn có chắc muốn ${currentStatus ? 'khóa' : 'mở khóa'} người dùng này?`)) {
            try {
                await adminService.updateUserStatus(userId, !currentStatus);
                loadUsers();
            } catch (error) {
                console.error('Error updating user status:', error);
                alert('Có lỗi xảy ra khi cập nhật trạng thái');
            }
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'SystemAdmin': return 'Quản trị viên';
            case 'ClinicAdmin': return 'Quản lý phòng khám';
            case 'Doctor': return 'Bác sĩ';
            case 'Patient': return 'Bệnh nhân';
            default: return role;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'SystemAdmin': return 'bg-red-100 text-red-800';
            case 'ClinicAdmin': return 'bg-purple-100 text-purple-800';
            case 'Doctor': return 'bg-blue-100 text-blue-800';
            case 'Patient': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h1>
                <p className="text-gray-600">Quản lý tất cả người dùng trong hệ thống</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo email, tên..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-48">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Tất cả vai trò</option>
                            <option value="Patient">Bệnh nhân</option>
                            <option value="Doctor">Bác sĩ</option>
                            <option value="ClinicAdmin">Quản lý phòng khám</option>
                            <option value="SystemAdmin">Quản trị viên</option>
                        </select>
                    </div>
                    <button
                        onClick={loadUsers}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Tìm kiếm
                    </button>
                </div>
            </div>

            {/* Users table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Đang tải...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-600">Không tìm thấy người dùng nào</p>
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
                                            Thông tin
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Vai trò
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày tạo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {user.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.fullName}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                    {user.phoneNumber && (
                                                        <p className="text-sm text-gray-500">{user.phoneNumber}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isActive
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {user.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                                                    </span>
                                                    {user.isEmailVerified && (
                                                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                            Đã xác thực
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                                                        className={`px-3 py-1 text-sm rounded ${user.isActive
                                                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                            }`}
                                                    >
                                                        {user.isActive ? 'Khóa' : 'Mở khóa'}
                                                    </button>
                                                    <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                                                        Chi tiết
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
                                    Trang {currentPage} của {totalPages}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
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