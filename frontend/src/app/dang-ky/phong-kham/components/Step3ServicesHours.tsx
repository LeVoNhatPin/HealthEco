// frontend/src/app/dang-ky/phong-kham/components/Step3ServicesHours.tsx
import { useState, useEffect } from 'react';
import { MedicalFacilityRequest } from '@/types/clinic';

interface Step3ServicesHoursProps {
    formData: MedicalFacilityRequest;
    updateFormData: (fields: Partial<MedicalFacilityRequest>) => void;
}

const DAYS = [
    { id: 'Monday', label: 'Thứ 2' },
    { id: 'Tuesday', label: 'Thứ 3' },
    { id: 'Wednesday', label: 'Thứ 4' },
    { id: 'Thursday', label: 'Thứ 5' },
    { id: 'Friday', label: 'Thứ 6' },
    { id: 'Saturday', label: 'Thứ 7' },
    { id: 'Sunday', label: 'Chủ nhật' }
];

const COMMON_SERVICES = [
    'Khám tổng quát',
    'Tư vấn sức khỏe',
    'Xét nghiệm máu',
    'Siêu âm',
    'X-quang',
    'Điện tim',
    'Nội soi',
    'Vật lý trị liệu',
    'Nha khoa',
    'Da liễu'
];

export default function Step3ServicesHours({ formData, updateFormData }: Step3ServicesHoursProps) {
    const [operatingHours, setOperatingHours] = useState<any>({});
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [customService, setCustomService] = useState('');

    useEffect(() => {
        try {
            const hours = JSON.parse(formData.operatingHours || '{}');
            setOperatingHours(hours);
        } catch {
            setOperatingHours({});
        }

        try {
            const services = JSON.parse(formData.services || '[]');
            setSelectedServices(services);
        } catch {
            setSelectedServices([]);
        }
    }, []);

    const updateHours = () => {
        updateFormData({ operatingHours: JSON.stringify(operatingHours) });
    };

    const updateServices = () => {
        updateFormData({ services: JSON.stringify(selectedServices) });
    };

    const handleTimeChange = (day: string, field: string, value: string) => {
        setOperatingHours((prev: any) => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value
            }
        }));
    };

    const handleToggleDay = (day: string) => {
        setOperatingHours((prev: any) => {
            const current = prev[day] || { isOpen: false, open: '08:00', close: '17:00' };
            return {
                ...prev,
                [day]: {
                    ...current,
                    isOpen: !current.isOpen
                }
            };
        });
    };

    const toggleService = (service: string) => {
        setSelectedServices(prev => {
            const newServices = prev.includes(service)
                ? prev.filter(s => s !== service)
                : [...prev, service];

            setTimeout(() => updateFormData({ services: JSON.stringify(newServices) }), 0);
            return newServices;
        });
    };

    const addCustomService = () => {
        if (customService.trim() && !selectedServices.includes(customService.trim())) {
            const newServices = [...selectedServices, customService.trim()];
            setSelectedServices(newServices);
            updateFormData({ services: JSON.stringify(newServices) });
            setCustomService('');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dịch vụ & Giờ làm việc</h2>

            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Giờ làm việc</h3>
                <div className="space-y-4">
                    {DAYS.map((day) => (
                        <div key={day.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`day-${day.id}`}
                                    checked={operatingHours[day.id]?.isOpen || false}
                                    onChange={() => handleToggleDay(day.id)}
                                    className="h-4 w-4 text-blue-600 rounded"
                                />
                                <label htmlFor={`day-${day.id}`} className="ml-2 w-20 font-medium">
                                    {day.label}
                                </label>
                            </div>

                            {operatingHours[day.id]?.isOpen && (
                                <div className="flex-1 flex items-center space-x-2">
                                    <input
                                        type="time"
                                        value={operatingHours[day.id]?.open || '08:00'}
                                        onChange={(e) => handleTimeChange(day.id, 'open', e.target.value)}
                                        className="px-3 py-2 border rounded"
                                    />
                                    <span>đến</span>
                                    <input
                                        type="time"
                                        value={operatingHours[day.id]?.close || '17:00'}
                                        onChange={(e) => handleTimeChange(day.id, 'close', e.target.value)}
                                        className="px-3 py-2 border rounded"
                                    />
                                </div>
                            )}

                            {!operatingHours[day.id]?.isOpen && (
                                <span className="text-gray-500">Nghỉ</span>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    onClick={updateHours}
                    className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                >
                    Lưu giờ làm
                </button>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Dịch vụ cung cấp</h3>
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {COMMON_SERVICES.map((service) => (
                            <button
                                key={service}
                                type="button"
                                onClick={() => toggleService(service)}
                                className={`px-4 py-2 rounded-full ${selectedServices.includes(service) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                {service}
                            </button>
                        ))}
                    </div>

                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={customService}
                            onChange={(e) => setCustomService(e.target.value)}
                            placeholder="Thêm dịch vụ khác..."
                            className="flex-1 px-4 py-2 border rounded-lg"
                            onKeyPress={(e) => e.key === 'Enter' && addCustomService()}
                        />
                        <button
                            onClick={addCustomService}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            Thêm
                        </button>
                    </div>
                </div>

                <div>
                    <h4 className="font-medium text-gray-700 mb-2">Dịch vụ đã chọn:</h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedServices.map((service) => (
                            <div
                                key={service}
                                className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg"
                            >
                                <span>{service}</span>
                                <button
                                    onClick={() => toggleService(service)}
                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        {selectedServices.length === 0 && (
                            <p className="text-gray-500 italic">Chưa có dịch vụ nào được chọn</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}