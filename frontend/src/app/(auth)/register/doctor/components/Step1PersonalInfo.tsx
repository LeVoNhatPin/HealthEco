// frontend/src/app/(auth)/register/doctor/components/Step1PersonalInfo.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Step1PersonalInfoProps {
    formData: {
        email: string;
        password: string;
        fullName: string;
        phoneNumber: string;
        dateOfBirth: string;
        address: string;
        city: string;
    };
    updateFormData: (data: Partial<{
        email: string;
        password: string;
        fullName: string;
        phoneNumber: string;
        dateOfBirth: string;
        address: string;
        city: string;
    }>) => void;
    nextStep: () => void;
}

const Step1PersonalInfo: React.FC<Step1PersonalInfoProps> = ({
    formData,
    updateFormData,
    nextStep
}) => {
    const isFormValid = () => {
        return formData.email &&
            formData.password &&
            formData.fullName &&
            formData.phoneNumber;
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
                <p className="text-gray-600">Vui lòng cung cấp thông tin cá nhân của bạn</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="fullName">Họ và tên *</Label>
                        <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => updateFormData({ fullName: e.target.value })}
                            placeholder="Nguyễn Văn A"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateFormData({ email: e.target.value })}
                            placeholder="example@email.com"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="password">Mật khẩu *</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => updateFormData({ password: e.target.value })}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="phoneNumber">Số điện thoại *</Label>
                        <Input
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
                            placeholder="0987654321"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                        <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="city">Thành phố</Label>
                        <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => updateFormData({ city: e.target.value })}
                            placeholder="Hà Nội"
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => updateFormData({ address: e.target.value })}
                        placeholder="Số nhà, đường, quận/huyện"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isFormValid()}
                >
                    Tiếp tục
                </Button>
            </div>
        </div>
    );
};

export default Step1PersonalInfo;