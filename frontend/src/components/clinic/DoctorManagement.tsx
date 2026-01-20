// File: frontend/src/components/clinic/DoctorManagement.tsx
'use client';

import { useState, useEffect } from 'react';
import { clinicService } from '@/services/clinic.service';
import { DoctorFacilityWork } from '@/types/clinic';

interface DoctorManagementProps {
    clinicId: number;
}

export default function DoctorManagement({ clinicId }: DoctorManagementProps) {
    const [doctors, setDoctors] = useState<DoctorFacilityWork[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        doctorId: 0,
        workType: 'EMPLOYEE',
        consultationFee: '',
        contractStartDate: '',
        contractEndDate: ''
    });

    useEffect(() => {
        loadDoctors();
    }, [clinicId]);

    const loadDoctors = async () => {
        try {
            const response = await clinicService.getClinicDoctors(clinicId);
            if (response.success) {
                setDoctors(response.data || []);
            }
        } catch (error) {
            console.error('Failed to load doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await clinicService.addDoctorToClinic(clinicId, {
                doctorId: formData.doctorId,
                facilityId: clinicId,
                workType: formData.workType,
                consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : undefined,
                contractStartDate: formData.contractStartDate || undefined,
                contractEndDate: formData.contractEndDate || undefined
            });

            alert('Đã gửi yêu cầu thêm bác sĩ');
            setShowAddForm(false);
            setFormData({
                doctorId: 0,
                workType: 'EMPLOYEE',
                consultationFee: '',
                contractStartDate: '',
                contractEndDate: ''
            });
            loadDoctors();
        } catch (error: any) {
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const updateStatus = async (id: number, status: string) => {
        if (confirm(`Bạn có chắc muốn ${status === 'APPROVED' ? 'phê duyệt' : 'từ chối'} bác sĩ này?`)) {
            try {
                await clinicService.updateDoctorFacilityWorkStatus(id, { status });
                loadDoctors();
            } catch (error) {
                alert('Có lỗi xảy ra');
            }
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">Đang tải danh sách bác sĩ...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Quản lý Bác sĩ</h3>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    {showAddForm ? 'Hủy' : '+ Thêm bác sĩ'}
                </button>
            </div>

            {showAddForm && (
                <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold mb-4">Thêm bác sĩ vào cơ sở</h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ID Bác sĩ
                            </label>
                            <input
                                type="number"
                                value={formData.doctorId}
                                onChange={(e) => setFormData({ ...formData, doctorId: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                                placeholder="Nhập ID bác sĩ"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại hợp tác
                            </label>
                            <select
                                value={formData.workType}
                                onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                            >
                                <option value="EMPLOYEE">Nhân viên</option>
                                <option value="CONTRACTOR">Cộng tác viên</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phí tư vấn (VND)
                                </label>
                                <input
                                    type="number"
                                    value={formData.consultationFee}
                                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="Để trống nếu dùng phí mặc định"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày bắt đầu hợp đồng
                                </label>
                                <input
                                    type="date"
                                    value={formData.contractStartDate}
                                    onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày kết thúc hợp đồng
                                </label>
                                <input
                                    type="date"
                                    value={formData.contractEndDate}
                                    onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                Gửi yêu cầu
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bác sĩ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Chuyên khoa
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Loại hợp tác
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phí tư vấn
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
                            {doctors.map((work) => (
                                <tr key={work.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-lg">👨‍⚕️</span>
                                            </div>
                                            <div className="ml-3">
                                                <p className="font-medium text-gray-900">
                                                    {work.doctor?.user?.fullName || `Bác sĩ #${work.doctorId}`}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {work.doctor?.medicalLicense || ''}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900">
                                            {work.doctor?.specialization?.name || 'Đa khoa'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                            {work.workType === 'OWNER' ? 'Chủ sở hữu' :
                                                work.workType === 'EMPLOYEE' ? 'Nhân viên' : 'Cộng tác viên'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-blue-600">
                                            {(work.consultationFee || work.doctor?.consultationFee || 0).toLocaleString()} VND
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${work.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                work.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {work.status === 'APPROVED' ? 'Đã phê duyệt' :
                                                work.status === 'PENDING' ? 'Chờ phê duyệt' : 'Từ chối'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <div className="flex space-x-2">
                                            {work.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => updateStatus(work.id, 'APPROVED')}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Duyệt
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(work.id, 'REJECTED')}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Từ chối
                                                    </button>
                                                </>
                                            )}
                                            <button className="text-blue-600 hover:text-blue-900">
                                                Chỉnh sửa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}