// frontend/src/app/(auth)/register/doctor/components/Step4FeeSetup.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Step4FeeSetupProps {
    formData: {
        consultationFee: number;
    };
    updateFormData: (data: Partial<{
        consultationFee: number;
    }>) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const Step4FeeSetup: React.FC<Step4FeeSetupProps> = ({
    formData,
    updateFormData,
    nextStep,
    prevStep
}) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Phí tư vấn</h2>
                <p className="text-gray-600">Thiết lập phí tư vấn cho mỗi cuộc hẹn</p>
            </div>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="consultationFee">Phí tư vấn (VNĐ) *</Label>
                    <Input
                        id="consultationFee"
                        type="number"
                        value={formData.consultationFee}
                        onChange={(e) => updateFormData({ consultationFee: Number(e.target.value) })}
                        placeholder="VD: 300000"
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Phí này sẽ được hiển thị cho bệnh nhân khi đặt lịch
                    </p>
                </div>
            </div>

            <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={prevStep}>
                    Quay lại
                </Button>
                <Button
                    type="button"
                    onClick={nextStep}
                    disabled={formData.consultationFee <= 0}
                >
                    Tiếp tục
                </Button>
            </div>
        </div>
    );
};

export default Step4FeeSetup;