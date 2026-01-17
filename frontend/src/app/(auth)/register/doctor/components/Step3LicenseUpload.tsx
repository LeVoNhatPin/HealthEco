// frontend/src/app/(auth)/register/doctor/components/Step3LicenseUpload.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface Step3LicenseUploadProps {
    formData: {
        medicalLicense: string;
        licenseImageUrl: string;
    };
    updateFormData: (data: Partial<{
        medicalLicense: string;
        licenseImageUrl: string;
    }>) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const Step3LicenseUpload: React.FC<Step3LicenseUploadProps> = ({
    formData,
    updateFormData,
    nextStep,
    prevStep
}) => {
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Trong thực tế, bạn sẽ upload file lên server và nhận URL
        // Ở đây tôi giả lập upload
        setUploading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const fakeUrl = URL.createObjectURL(file);
        updateFormData({ licenseImageUrl: fakeUrl });
        setUploading(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Giấy phép hành nghề</h2>
                <p className="text-gray-600">Vui lòng cung cấp thông tin giấy phép hành nghề</p>
            </div>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="medicalLicense">Số giấy phép hành nghề *</Label>
                    <Input
                        id="medicalLicense"
                        value={formData.medicalLicense}
                        onChange={(e) => updateFormData({ medicalLicense: e.target.value })}
                        placeholder="VD: BS-001-2024"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="licenseImage">Ảnh giấy phép hành nghề</Label>
                    <div className="mt-2 flex items-center justify-center w-full">
                        <label
                            htmlFor="licenseImage"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                            {formData.licenseImageUrl ? (
                                <div className="p-4">
                                    <img
                                        src={formData.licenseImageUrl}
                                        alt="License"
                                        className="max-h-48 max-w-full"
                                    />
                                    <p className="mt-2 text-sm text-gray-500">Ảnh đã tải lên</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click để upload</span> hoặc kéo thả
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, PDF (MAX. 5MB)</p>
                                </div>
                            )}
                            <input
                                id="licenseImage"
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                    {uploading && (
                        <p className="mt-2 text-sm text-blue-600">Đang tải lên...</p>
                    )}
                </div>
            </div>

            <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={prevStep}>
                    Quay lại
                </Button>
                <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.medicalLicense}
                >
                    Tiếp tục
                </Button>
            </div>
        </div>
    );
};

export default Step3LicenseUpload;