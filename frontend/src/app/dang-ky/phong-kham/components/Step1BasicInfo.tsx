// frontend/src/app/dang-ky/phong-kham/components/Step1BasicInfo.tsx
'use client';

import { MedicalFacilityRequest } from '@/types/clinic';

interface Step1BasicInfoProps {
    formData: MedicalFacilityRequest;
    updateFormData: (fields: Partial<MedicalFacilityRequest>) => void;
}

export default function Step1BasicInfo({ formData, updateFormData }: Step1BasicInfoProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin cơ bản</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên phòng khám *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateFormData({ name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="VD: Phòng khám Đa khoa HealthEco"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại cơ sở *
                    </label>
                    <select
                        value={formData.facilityType}
                        onChange={(e) => updateFormData({ facilityType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="CLINIC">Phòng khám</option>
                        <option value="HOSPITAL">Bệnh viện</option>
                        <option value="HOME_CLINIC">Phòng khám tại nhà</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thành phố *
                    </label>
                    <select
                        value={formData.city}
                        onChange={(e) => updateFormData({ city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Chọn thành phố</option>
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                        <option value="Hải Phòng">Hải Phòng</option>
                        <option value="Cần Thơ">Cần Thơ</option>
                        <option value="Huế">Huế</option>
                        <option value="Nha Trang">Nha Trang</option>
                        <option value="Đà Lạt">Đà Lạt</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả phòng khám
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => updateFormData({ description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                        placeholder="Mô tả về phòng khám của bạn..."
                    />
                </div>
            </div>
        </div>
    );
}