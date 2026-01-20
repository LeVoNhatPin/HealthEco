// frontend/src/app/dang-ky/phong-kham/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clinicService } from '@/services/clinic.service';
import Step1BasicInfo from './components/Step1BasicInfo';
import Step2LicenseAddress from './components/Step2LicenseAddress';
import Step3ServicesHours from './components/Step3ServicesHours';
import Step4ContactInfo from './components/Step4ContactInfo';
import Step5Confirmation from './components/Step5Confirmation';
import { MedicalFacilityRequest } from '@/types/clinic';

const steps = [
    'Thông tin cơ bản',
    'Giấy phép & Địa chỉ',
    'Dịch vụ & Giờ làm',
    'Thông tin liên hệ',
    'Xác nhận'
];

export default function ClinicRegistrationPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<MedicalFacilityRequest>({
        name: '',
        facilityType: 'CLINIC',
        licenseNumber: '',
        licenseImageUrl: '',
        address: '',
        city: '',
        phone: '',
        email: '',
        operatingHours: JSON.stringify({
            Monday: { open: '08:00', close: '17:00', isOpen: true },
            Tuesday: { open: '08:00', close: '17:00', isOpen: true },
            Wednesday: { open: '08:00', close: '17:00', isOpen: true },
            Thursday: { open: '08:00', close: '17:00', isOpen: true },
            Friday: { open: '08:00', close: '17:00', isOpen: true },
            Saturday: { open: '08:00', close: '12:00', isOpen: true },
            Sunday: { open: '08:00', close: '12:00', isOpen: true }
        }),
        services: JSON.stringify([
            'Khám tổng quát',
            'Tư vấn sức khỏe',
            'Xét nghiệm cơ bản'
        ]),
        description: '',
        avatarUrl: '',
        bannerUrl: ''
    });

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await clinicService.registerClinic(formData);
            if (response.success) {
                alert('Đăng ký cơ sở y tế thành công! Vui lòng chờ xác minh từ quản trị viên.');
                router.push('/bang-dieu-khien');
            } else {
                alert('Đăng ký thất bại: ' + response.message);
            }
        } catch (error: any) {
            console.group("❌ Register Clinic Failed");

            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Response data:", error.response.data);
                console.error("Headers:", error.response.headers);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error message:", error.message);
            }

            console.error("Full error object:", error);
            console.groupEnd();
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const updateFormData = (fields: Partial<MedicalFacilityRequest>) => {
        setFormData(prev => ({ ...prev, ...fields }));
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1BasicInfo formData={formData} updateFormData={updateFormData} />;
            case 2:
                return <Step2LicenseAddress formData={formData} updateFormData={updateFormData} />;
            case 3:
                return <Step3ServicesHours formData={formData} updateFormData={updateFormData} />;
            case 4:
                return <Step4ContactInfo formData={formData} updateFormData={updateFormData} />;
            case 5:
                return <Step5Confirmation formData={formData} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Đăng ký Cơ sở Y tế</h1>
                    <p className="text-lg text-gray-600">Hoàn thành các bước sau để đăng ký cơ sở y tế của bạn</p>
                </div>

                <div className="mb-12">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep > index + 1 ? 'bg-green-500 border-green-500 text-white' : currentStep === index + 1 ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-500'}`}
                                >
                                    {index + 1}
                                </div>
                                <div className="ml-3 text-sm font-medium text-gray-700">{step}</div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-6 ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {renderStep()}

                    <div className="flex justify-between mt-12">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className={`px-8 py-3 rounded-lg font-medium ${currentStep === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            Quay lại
                        </button>

                        {currentStep < steps.length ? (
                            <button
                                onClick={handleNext}
                                className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
                            >
                                Tiếp theo
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`px-8 py-3 rounded-lg font-medium ${isSubmitting ? 'bg-green-400 cursor-wait' : 'bg-green-500 hover:bg-green-600'} text-white`}
                            >
                                {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}