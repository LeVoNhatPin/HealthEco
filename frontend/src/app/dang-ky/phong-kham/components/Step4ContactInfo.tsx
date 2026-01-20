// frontend/src/app/dang-ky/phong-kham/components/Step4ContactInfo.tsx
import { MedicalFacilityRequest } from '@/types/clinic';

interface Step4ContactInfoProps {
    formData: MedicalFacilityRequest;
    updateFormData: (fields: Partial<MedicalFacilityRequest>) => void;
}

export default function Step4ContactInfo({ formData, updateFormData }: Step4ContactInfoProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin liên hệ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại *
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData({ phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="VD: 024 1234 5678"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email liên hệ
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData({ email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="VD: contact@clinic.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ảnh đại diện
                    </label>
                    <input
                        type="text"
                        value={formData.avatarUrl}
                        onChange={(e) => updateFormData({ avatarUrl: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="URL ảnh đại diện"
                    />
                    <p className="text-xs text-gray-500 mt-1">Để trống để sử dụng ảnh mặc định</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ảnh bìa
                    </label>
                    <input
                        type="text"
                        value={formData.bannerUrl}
                        onChange={(e) => updateFormData({ bannerUrl: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="URL ảnh bìa"
                    />
                    <p className="text-xs text-gray-500 mt-1">Để trống để sử dụng ảnh mặc định</p>
                </div>
            </div>
        </div>
    );
}   