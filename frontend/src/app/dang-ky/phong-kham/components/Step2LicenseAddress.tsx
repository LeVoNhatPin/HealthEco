// frontend/src/app/dang-ky/phong-kham/components/Step2LicenseAddress.tsx
import { useState } from 'react';
import { MedicalFacilityRequest } from '@/types/clinic';

interface Step2LicenseAddressProps {
    formData: MedicalFacilityRequest;
    updateFormData: (fields: Partial<MedicalFacilityRequest>) => void;
}

export default function Step2LicenseAddress({ formData, updateFormData }: Step2LicenseAddressProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (file: File) => {
        setIsUploading(true);
        try {
            // TODO: Implement file upload to your storage service
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockUrl = `https://example.com/uploads/${file.name}`;
            updateFormData({ licenseImageUrl: mockUrl });
        } catch (error) {
            alert('Lỗi tải lên file');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Giấy phép & Địa chỉ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số giấy phép hành nghề *
                    </label>
                    <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => updateFormData({ licenseNumber: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="VD: PK-001-HN-2024"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hình ảnh giấy phép
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {formData.licenseImageUrl ? (
                            <div className="text-green-600">
                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="mt-2">Đã tải lên thành công</p>
                                <button
                                    onClick={() => updateFormData({ licenseImageUrl: '' })}
                                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                                >
                                    Xóa
                                </button>
                            </div>
                        ) : (
                            <div>
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <label className="mt-4 cursor-pointer">
                                    <span className="mt-2 text-sm text-gray-600">Tải lên file giấy phép</span>
                                    <input
                                        type="file"
                                        className="sr-only"
                                        accept="image/*,.pdf"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileUpload(file);
                                        }}
                                        disabled={isUploading}
                                    />
                                </label>
                                <p className="text-xs text-gray-500 mt-2">PNG, JPG, PDF tối đa 10MB</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ đầy đủ *
                    </label>
                    <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => updateFormData({ address: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="VD: Số nhà, tên đường, phường/xã, quận/huyện"
                        required
                    />
                </div>
            </div>
        </div>
    );
}