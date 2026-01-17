// frontend/src/app/(auth)/register/doctor/components/Step2ProfessionalInfo.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { doctorService } from '@/services/doctor.service';
import { Specialization } from '@/types/doctor';

interface Step2ProfessionalInfoProps {
    formData: {
        specializationId: number;
        yearsExperience: number;
        qualifications: string;
        bio: string;
    };
    updateFormData: (data: Partial<{
        specializationId: number;
        yearsExperience: number;
        qualifications: string;
        bio: string;
    }>) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const Step2ProfessionalInfo: React.FC<Step2ProfessionalInfoProps> = ({
    formData,
    updateFormData,
    nextStep,
    prevStep
}) => {
    const [specializations, setSpecializations] = useState<Specialization[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSpecializations();
    }, []);

    const loadSpecializations = async () => {
        try {
            const response = await doctorService.getSpecializations();
            if (response.data.success) {
                setSpecializations(response.data.data);
            }
        } catch (error) {
            console.error('Error loading specializations:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Thông tin chuyên môn</h2>
                <p className="text-gray-600">Vui lòng cung cấp thông tin chuyên môn của bạn</p>
            </div>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="specializationId">Chuyên khoa *</Label>
                    <select
                        id="specializationId"
                        value={formData.specializationId}
                        onChange={(e) => updateFormData({ specializationId: Number(e.target.value) })}
                        className="w-full p-2 border rounded-md"
                        required
                        disabled={loading}
                    >
                        <option value="">Chọn chuyên khoa</option>
                        {specializations.map((spec) => (
                            <option key={spec.id} value={spec.id}>
                                {spec.name}
                            </option>
                        ))}
                    </select>
                    {loading && <p className="text-sm text-gray-500 mt-1">Đang tải danh sách chuyên khoa...</p>}
                </div>

                <div>
                    <Label htmlFor="yearsExperience">Số năm kinh nghiệm *</Label>
                    <Input
                        id="yearsExperience"
                        type="number"
                        value={formData.yearsExperience}
                        onChange={(e) => updateFormData({ yearsExperience: Number(e.target.value) })}
                        placeholder="5"
                        min="0"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="qualifications">Bằng cấp, chứng chỉ *</Label>
                    <Textarea
                        id="qualifications"
                        value={formData.qualifications}
                        onChange={(e) => updateFormData({ qualifications: e.target.value })}
                        placeholder="Ví dụ: Bác sĩ chuyên khoa I, Đại học Y Hà Nội, Chứng chỉ siêu âm..."
                        rows={3}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="bio">Tiểu sử chuyên môn</Label>
                    <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => updateFormData({ bio: e.target.value })}
                        placeholder="Giới thiệu về kinh nghiệm làm việc, phương châm hành nghề..."
                        rows={4}
                    />
                </div>
            </div>

            <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={prevStep}>
                    Quay lại
                </Button>
                <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.specializationId || !formData.qualifications}
                >
                    Tiếp tục
                </Button>
            </div>
        </div>
    );
};

export default Step2ProfessionalInfo;