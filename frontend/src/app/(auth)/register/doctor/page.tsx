// frontend/src/app/(auth)/register/doctor/page.tsx
'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import Step1PersonalInfo from './components/Step1PersonalInfo';
import Step2ProfessionalInfo from './components/Step2ProfessionalInfo';
import Step3LicenseUpload from './components/Step3LicenseUpload';
import Step4FeeSetup from './components/Step4FeeSetup';
import Step5Confirmation from './components/Step5Confirmation';
import { doctorService } from '@/services/doctor.service';
import { useRouter } from 'next/navigation';

const DoctorRegisterPage = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Step 1: Personal Info
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        dateOfBirth: '',
        address: '',
        city: '',

        // Step 2: Professional Info
        specializationId: 0,
        yearsExperience: 0,
        qualifications: '',
        bio: '',

        // Step 3: License
        medicalLicense: '',
        licenseImageUrl: '',

        // Step 4: Fee
        consultationFee: 300000,
    });

    const updateFormData = (data: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        if (step < 5) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const submitForm = async () => {
        try {
            setIsLoading(true);

            // Format data for API
            const submitData = {
                ...formData,
                dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
                specializationId: Number(formData.specializationId),
                yearsExperience: Number(formData.yearsExperience),
                consultationFee: Number(formData.consultationFee),
            };

            const response = await doctorService.register(submitData);

            if (response.success) {
                alert('Đăng ký bác sĩ thành công! Vui lòng chờ xác minh từ quản trị viên.');
                router.push('/login');
            } else {
                alert('Đăng ký thất bại: ' + response.message);
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            alert(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Step1PersonalInfo
                        formData={formData}
                        updateFormData={updateFormData}
                        nextStep={nextStep}
                    />
                );
            case 2:
                return (
                    <Step2ProfessionalInfo
                        formData={formData}
                        updateFormData={updateFormData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );
            case 3:
                return (
                    <Step3LicenseUpload
                        formData={formData}
                        updateFormData={updateFormData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );
            case 4:
                return (
                    <Step4FeeSetup
                        formData={formData}
                        updateFormData={updateFormData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );
            case 5:
                return (
                    <Step5Confirmation
                        formData={formData}
                        submitForm={submitForm}
                        prevStep={prevStep}
                        isLoading={isLoading}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <Card className="p-8 shadow-xl">
                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                {[1, 2, 3, 4, 5].map((stepNumber) => (
                                    <div
                                        key={stepNumber}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${stepNumber <= step
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                            }`}
                                    >
                                        {stepNumber}
                                    </div>
                                ))}
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full">
                                <div
                                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                    style={{ width: `${((step - 1) / 4) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 mt-2">
                                <span>Thông tin cá nhân</span>
                                <span>Chuyên môn</span>
                                <span>Giấy phép</span>
                                <span>Phí</span>
                                <span>Xác nhận</span>
                            </div>
                        </div>

                        {/* Step Content */}
                        {renderStep()}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DoctorRegisterPage;