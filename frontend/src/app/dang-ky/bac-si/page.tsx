// frontend/src/app/dang-ky/bac-si/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doctorService } from '@/services/doctor.service';
import { SpecializationResponse } from '@/types/doctor';

export default function BacSiDangKyPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [specializations, setSpecializations] = useState<SpecializationResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        dateOfBirth: '',
        address: '',
        city: '',
        medicalLicense: '',
        licenseImageUrl: '',
        specializationId: 0,
        yearsExperience: 0,
        qualifications: '',
        bio: '',
        consultationFee: 0,
    });

    useEffect(() => {
        loadSpecializations();
    }, []);

    const loadSpecializations = async () => {
        try {
            const response = await doctorService.getSpecializations();
            if (response.success) {
                setSpecializations(response.data);
            }
        } catch (error) {
            console.error('Lỗi tải chuyên khoa:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'number'
                ? (name === 'specializationId' || name === 'yearsExperience' || name === 'consultationFee')
                    ? Number(value)
                    : prev[name as keyof typeof prev]
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Chuẩn bị dữ liệu
            const payload = {
                ...formData,
                phoneNumber: formData.phoneNumber || undefined,
                dateOfBirth: formData.dateOfBirth || undefined,
                address: formData.address || undefined,
                city: formData.city || undefined,
                licenseImageUrl: formData.licenseImageUrl || undefined,
                bio: formData.bio || undefined,
                specializationId: Number(formData.specializationId),
                yearsExperience: Number(formData.yearsExperience),
                consultationFee: Number(formData.consultationFee),
            };

            console.log('Đang gửi đăng ký bác sĩ:', payload);

            const response = await doctorService.register(payload);

            if (response.success) {
                alert('Đăng ký bác sĩ thành công! Vui lòng chờ xác minh từ quản trị viên.');
                router.push('/bac-si');
            } else {
                setError(response.message || 'Đăng ký thất bại');
            }
        } catch (error: any) {
            console.error('Lỗi đăng ký:', error);
            setError(error.message || 'Có lỗi xảy ra khi đăng ký');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step < 5) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Đăng ký Bác sĩ</h1>

            {/* Thanh tiến trình */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    {[1, 2, 3, 4, 5].map((stepNum) => (
                        <div key={stepNum} className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stepNum <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                                }`}>
                                {stepNum}
                            </div>
                            <span className="mt-2 text-sm">Bước {stepNum}</span>
                        </div>
                    ))}
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                {/* Bước 1: Thông tin cá nhân */}
                {step === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>

                        <div>
                            <label className="block text-sm font-medium mb-1">Họ và tên *</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Mật khẩu *</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>
                )}

                {/* Bước 2: Địa chỉ */}
                {step === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Địa chỉ liên hệ</h2>

                        <div>
                            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Thành phố</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>
                )}

                {/* Bước 3: Thông tin chuyên môn */}
                {step === 3 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Thông tin chuyên môn</h2>

                        <div>
                            <label className="block text-sm font-medium mb-1">Số giấy phép hành nghề *</label>
                            <input
                                type="text"
                                name="medicalLicense"
                                value={formData.medicalLicense}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Chuyên khoa *</label>
                            <select
                                name="specializationId"
                                value={formData.specializationId}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Chọn chuyên khoa</option>
                                {specializations.map((spec) => (
                                    <option key={spec.id} value={spec.id}>
                                        {spec.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Số năm kinh nghiệm</label>
                            <input
                                type="number"
                                name="yearsExperience"
                                value={formData.yearsExperience}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Bằng cấp *</label>
                            <textarea
                                name="qualifications"
                                value={formData.qualifications}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                rows={3}
                                required
                                placeholder="Ví dụ: Bác sĩ chuyên khoa I, Đại học Y Hà Nội..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Giới thiệu bản thân</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                rows={3}
                                placeholder="Giới thiệu về kinh nghiệm và chuyên môn của bạn..."
                            />
                        </div>
                    </div>
                )}

                {/* Bước 4: Phí tư vấn */}
                {step === 4 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Phí tư vấn</h2>

                        <div>
                            <label className="block text-sm font-medium mb-1">Phí tư vấn (VNĐ) *</label>
                            <input
                                type="number"
                                name="consultationFee"
                                value={formData.consultationFee}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                                min="0"
                            />
                            <p className="text-sm text-gray-500 mt-1">Phí tư vấn cho mỗi lần khám</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Ảnh giấy phép hành nghề (URL)</label>
                            <input
                                type="url"
                                name="licenseImageUrl"
                                value={formData.licenseImageUrl}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                placeholder="https://example.com/license.jpg"
                            />
                            <p className="text-sm text-gray-500 mt-1">Đường dẫn đến ảnh giấy phép (nếu có)</p>
                        </div>
                    </div>
                )}

                {/* Bước 5: Xác nhận */}
                {step === 5 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Xác nhận thông tin</h2>

                        <div className="bg-gray-50 p-4 rounded">
                            <h3 className="font-semibold mb-2">Thông tin cá nhân</h3>
                            <p><strong>Họ tên:</strong> {formData.fullName}</p>
                            <p><strong>Email:</strong> {formData.email}</p>
                            <p><strong>SĐT:</strong> {formData.phoneNumber || 'Chưa cung cấp'}</p>

                            <h3 className="font-semibold mt-4 mb-2">Thông tin chuyên môn</h3>
                            <p><strong>Số giấy phép:</strong> {formData.medicalLicense}</p>
                            <p><strong>Chuyên khoa:</strong> {
                                specializations.find(s => s.id === formData.specializationId)?.name || 'Chưa chọn'
                            }</p>
                            <p><strong>Số năm kinh nghiệm:</strong> {formData.yearsExperience}</p>
                            <p><strong>Phí tư vấn:</strong> {formData.consultationFee.toLocaleString()} VNĐ</p>
                        </div>

                        <div className="mt-4">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" required />
                                <span>Tôi xác nhận thông tin trên là chính xác và đồng ý với điều khoản sử dụng</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Nút điều hướng */}
                <div className="flex justify-between mt-8">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Quay lại
                        </button>
                    )}

                    {step < 5 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
                        >
                            Tiếp tục
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 ml-auto"
                        >
                            {loading ? 'Đang xử lý...' : 'Đăng ký'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}