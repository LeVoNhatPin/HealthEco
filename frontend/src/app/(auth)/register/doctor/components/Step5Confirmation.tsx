// frontend/src/app/(auth)/register/doctor/components/Step5Confirmation.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface Step5ConfirmationProps {
    formData: any;
    submitForm: () => void;
    prevStep: () => void;
    isLoading: boolean;
}

const Step5Confirmation: React.FC<Step5ConfirmationProps> = ({
    formData,
    submitForm,
    prevStep,
    isLoading
}) => {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Xác nhận thông tin</h2>
                <p className="text-gray-600">Vui lòng kiểm tra lại thông tin trước khi đăng ký</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold">Thông tin cá nhân</h3>
                        <p className="text-gray-600">Họ tên: {formData.fullName}</p>
                        <p className="text-gray-600">Email: {formData.email}</p>
                        <p className="text-gray-600">Số điện thoại: {formData.phoneNumber}</p>
                        <p className="text-gray-600">Thành phố: {formData.city}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Thông tin chuyên môn</h3>
                        <p className="text-gray-600">Số giấy phép: {formData.medicalLicense}</p>
                        <p className="text-gray-600">Năm kinh nghiệm: {formData.yearsExperience}</p>
                        <p className="text-gray-600">Phí tư vấn: {formData.consultationFee.toLocaleString()} VNĐ</p>
                    </div>
                </div>

                {formData.bio && (
                    <div>
                        <h3 className="font-semibold">Tiểu sử</h3>
                        <p className="text-gray-600">{formData.bio}</p>
                    </div>
                )}

                {formData.qualifications && (
                    <div>
                        <h3 className="font-semibold">Bằng cấp</h3>
                        <p className="text-gray-600">{formData.qualifications}</p>
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={prevStep}>
                    Quay lại
                </Button>
                <Button
                    type="button"
                    onClick={submitForm}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                >
                    {isLoading ? 'Đang đăng ký...' : 'Xác nhận đăng ký'}
                </Button>
            </div>
        </div>
    );
};

export default Step5Confirmation;