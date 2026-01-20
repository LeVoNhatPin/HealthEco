// frontend/src/app/dang-ky/phong-kham/components/Step5Confirmation.tsx
import { MedicalFacilityRequest } from '@/types/clinic';
import { clinicService } from '@/services/clinic.service';

interface Step5ConfirmationProps {
    formData: MedicalFacilityRequest;
}

export default function Step5Confirmation({ formData }: Step5ConfirmationProps) {
    const getFacilityTypeName = (type: string) => {
        switch (type) {
            case 'HOSPITAL': return 'Bệnh viện';
            case 'CLINIC': return 'Phòng khám';
            case 'HOME_CLINIC': return 'Phòng khám tại nhà';
            default: return type;
        }
    };

    const operatingHours = clinicService.parseOperatingHours(formData.operatingHours || '{}');
    const services = clinicService.parseServices(formData.services || '[]');

    const DAYS_MAP: { [key: string]: string } = {
        Monday: 'Thứ 2',
        Tuesday: 'Thứ 3',
        Wednesday: 'Thứ 4',
        Thursday: 'Thứ 5',
        Friday: 'Thứ 6',
        Saturday: 'Thứ 7',
        Sunday: 'Chủ nhật'
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Xác nhận thông tin</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <div className="flex items-center">
                    <svg className="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-blue-700">
                        Vui lòng kiểm tra kỹ thông tin trước khi gửi. Thông tin sẽ được kiểm duyệt bởi quản trị viên.
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Thông tin cơ bản</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Tên cơ sở</p>
                            <p className="font-medium">{formData.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Loại cơ sở</p>
                            <p className="font-medium">{getFacilityTypeName(formData.facilityType)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Thành phố</p>
                            <p className="font-medium">{formData.city}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Số giấy phép</p>
                            <p className="font-medium">{formData.licenseNumber}</p>
                        </div>
                    </div>
                    {formData.description && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-500">Mô tả</p>
                            <p className="mt-1 text-gray-700 whitespace-pre-line">{formData.description}</p>
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Địa chỉ</h3>
                    <p className="font-medium">{formData.address}</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Thông tin liên hệ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Điện thoại</p>
                            <p className="font-medium">{formData.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{formData.email || 'Không có'}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Giờ làm việc</h3>
                    <div className="space-y-2">
                        {Object.entries(operatingHours).map(([day, hours]: [string, any]) => (
                            <div key={day} className="flex justify-between items-center">
                                <span className="font-medium">{DAYS_MAP[day] || day}</span>
                                <span>
                                    {hours.isOpen
                                        ? `${hours.open} - ${hours.close}`
                                        : <span className="text-red-500">Nghỉ</span>
                                    }
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Dịch vụ cung cấp</h3>
                    <div className="flex flex-wrap gap-2">
                        {services.length > 0 ? (
                            services.map((service: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                >
                                    {service}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">Chưa có dịch vụ nào</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}