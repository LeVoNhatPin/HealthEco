// frontend/src/app/phong-kham/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { clinicService } from '@/services/clinic.service';
import { MedicalFacility, DoctorFacilityWork } from '@/types/clinic';

interface ClinicDetailResponse {
    clinic: MedicalFacility;
    doctors: DoctorFacilityWork[];
}

export default function ClinicDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [clinic, setClinic] = useState<MedicalFacility | null>(null);
    const [doctors, setDoctors] = useState<DoctorFacilityWork[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [showAllDoctors, setShowAllDoctors] = useState(false);

    useEffect(() => {
        loadClinicDetails();
    }, [id]);

    const loadClinicDetails = async () => {
        setLoading(true);
        try {
            const response = await clinicService.getClinic(parseInt(id));
            if (response.success) {
                setClinic(response.data.clinic);
                setDoctors(response.data.doctors || []);
            } else {
                router.push('/phong-kham');
            }
        } catch (error) {
            console.error('Failed to load clinic details:', error);
            router.push('/phong-kham');
        } finally {
            setLoading(false);
        }
    };

    const getFacilityTypeName = (type: string) => {
        switch (type) {
            case 'HOSPITAL': return 'Bệnh viện';
            case 'CLINIC': return 'Phòng khám';
            case 'HOME_CLINIC': return 'Phòng khám tại nhà';
            default: return type;
        }
    };

    const parseOperatingHours = (hoursJson: string) => {
        try {
            return JSON.parse(hoursJson);
        } catch {
            return {};
        }
    };

    const parseServices = (servicesJson: string) => {
        try {
            const services = JSON.parse(servicesJson);
            return Array.isArray(services) ? services : [];
        } catch {
            return [];
        }
    };

    const formatTime = (time: string) => {
        return time || '--:--';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Đang tải thông tin cơ sở y tế...</p>
                </div>
            </div>
        );
    }

    if (!clinic) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-2xl text-gray-600">Không tìm thấy cơ sở y tế</p>
                    <button
                        onClick={() => router.push('/phong-kham')}
                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }

    const operatingHours = parseOperatingHours(clinic.operatingHours || '{}');
    const services = parseServices(clinic.services || '[]');
    const displayedDoctors = showAllDoctors ? doctors : doctors.slice(0, 6);

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
        <div className="min-h-screen bg-gray-50">
            <div className="relative">
                <div className="h-64 bg-gradient-to-r from-blue-500 to-cyan-500">
                    {clinic.bannerUrl ? (
                        <img
                            src={clinic.bannerUrl}
                            alt={clinic.name}
                            className="w-full h-full object-cover opacity-90"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl text-white">🏥</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative">
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <div className="flex flex-col md:flex-row md:items-start">
                            <div className="flex-shrink-0">
                                {clinic.avatarUrl ? (
                                    <img
                                        src={clinic.avatarUrl}
                                        alt={clinic.name}
                                        className="w-32 h-32 rounded-full border-8 border-white shadow-lg"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full border-8 border-white shadow-lg bg-blue-100 flex items-center justify-center">
                                        <span className="text-4xl">🏥</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 md:mt-0 md:ml-8 flex-1">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">{clinic.name}</h1>
                                        <div className="flex items-center mt-2">
                                            <span className="text-yellow-400 text-xl">★★★★★</span>
                                            <span className="ml-2 text-gray-600">
                                                {clinic.rating.toFixed(1)} ({clinic.totalReviews} đánh giá)
                                            </span>
                                            {clinic.isVerified && (
                                                <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                    ✅ Đã xác minh
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center mt-2 text-gray-600">
                                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <span>{getFacilityTypeName(clinic.facilityType)}</span>
                                            <span className="mx-2">•</span>
                                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{clinic.city}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 md:mt-0">
                                        <button className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                                            Đặt lịch ngay
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8 border-b">
                                    <nav className="flex space-x-8">
                                        {['overview', 'doctors', 'services', 'reviews'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                            >
                                                {tab === 'overview' && 'Tổng quan'}
                                                {tab === 'doctors' && `Bác sĩ (${doctors.length})`}
                                                {tab === 'services' && 'Dịch vụ'}
                                                {tab === 'reviews' && `Đánh giá (${clinic.totalReviews})`}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                {clinic.description && (
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">Giới thiệu</h2>
                                        <p className="text-gray-700 whitespace-pre-line">{clinic.description}</p>
                                    </div>
                                )}

                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Dịch vụ chính</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {services.slice(0, 8).map((service: string, index: number) => (
                                            <div key={index} className="flex items-center">
                                                <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>{service}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {services.length > 8 && (
                                        <button
                                            onClick={() => setActiveTab('services')}
                                            className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
                                        >
                                            Xem tất cả {services.length} dịch vụ →
                                        </button>
                                    )}
                                </div>

                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Đội ngũ bác sĩ</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {displayedDoctors.map((work) => (
                                            <div key={work.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex items-center">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-lg">👨‍⚕️</span>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="font-semibold text-gray-900">
                                                            {work.doctor?.user?.fullName || 'Bác sĩ'}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {work.doctor?.specialization?.name || 'Đa khoa'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <span className="text-sm font-medium text-blue-600">
                                                        {work.consultationFee?.toLocaleString() || 'Liên hệ'} VND
                                                    </span>
                                                    <a
                                                        href={`/bac-si/${work.doctorId}`}
                                                        className="text-sm text-gray-500 hover:text-blue-600"
                                                    >
                                                        Chi tiết →
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {doctors.length > 6 && (
                                        <button
                                            onClick={() => setActiveTab('doctors')}
                                            className="mt-6 w-full text-center text-blue-500 hover:text-blue-700 font-medium"
                                        >
                                            Xem tất cả {doctors.length} bác sĩ →
                                        </button>
                                    )}
                                </div>

                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Giờ làm việc</h2>
                                    <div className="space-y-3">
                                        {Object.entries(operatingHours).map(([day, hours]: [string, any]) => (
                                            <div key={day} className="flex justify-between items-center py-2 border-b last:border-0">
                                                <span className="font-medium">{DAYS_MAP[day] || day}</span>
                                                <span className={hours.isOpen ? 'text-green-600' : 'text-red-600'}>
                                                    {hours.isOpen ? `${formatTime(hours.open)} - ${formatTime(hours.close)}` : 'Nghỉ'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'doctors' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Đội ngũ bác sĩ</h2>
                                <div className="space-y-6">
                                    {doctors.map((work) => (
                                        <div key={work.id} className="border rounded-xl p-6 hover:shadow-lg transition-shadow">
                                            <div className="flex flex-col md:flex-row md:items-center">
                                                <div className="flex items-center md:w-1/3">
                                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-2xl">👨‍⚕️</span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-xl font-bold text-gray-900">
                                                            {work.doctor?.user?.fullName}
                                                        </h3>
                                                        <p className="text-blue-600 font-medium">
                                                            {work.doctor?.specialization?.name}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 md:mt-0 md:w-1/3">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center text-gray-600">
                                                            <span className="font-medium mr-2">Kinh nghiệm:</span>
                                                            <span>{work.doctor?.yearsExperience} năm</span>
                                                        </div>
                                                        <div className="flex items-center text-gray-600">
                                                            <span className="font-medium mr-2">Loại hợp tác:</span>
                                                            <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                                                                {work.workType === 'OWNER' ? 'Chủ sở hữu' :
                                                                    work.workType === 'EMPLOYEE' ? 'Nhân viên' : 'Cộng tác viên'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 md:mt-0 md:w-1/3 text-right">
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        {work.consultationFee?.toLocaleString()} VND
                                                    </div>
                                                    <div className="text-sm text-gray-500">/ lượt tư vấn</div>
                                                    <div className="mt-4 flex space-x-2 justify-end">
                                                        <a
                                                            href={`/bac-si/${work.doctorId}`}
                                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                                        >
                                                            Xem hồ sơ
                                                        </a>
                                                        <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50">
                                                            Đặt lịch
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'services' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dịch vụ cung cấp</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {services.map((service: string, index: number) => (
                                        <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                            <div className="flex items-start">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xl">🩺</span>
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-semibold text-gray-900">{service}</h3>
                                                    <p className="text-gray-600 mt-2">
                                                        Dịch vụ {service.toLowerCase()} được thực hiện bởi đội ngũ bác sĩ chuyên môn cao.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá từ bệnh nhân</h2>
                                <div className="text-center py-12">
                                    <div className="inline-block p-8 bg-gray-50 rounded-2xl">
                                        <div className="text-6xl mb-4">⭐</div>
                                        <div className="text-4xl font-bold">{clinic.rating.toFixed(1)}/5.0</div>
                                        <div className="text-gray-600 mt-2">Dựa trên {clinic.totalReviews} đánh giá</div>
                                    </div>
                                    <p className="mt-8 text-gray-500">
                                        Tính năng đánh giá đang được phát triển. Quay lại sau nhé!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin liên hệ</h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-500">📞</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-500">Điện thoại</p>
                                        <p className="font-medium">{clinic.phone}</p>
                                    </div>
                                </div>

                                {clinic.email && (
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-500">📧</span>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{clinic.email}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-500">📍</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-500">Địa chỉ</p>
                                        <p className="font-medium">{clinic.address}</p>
                                        <p className="text-sm text-gray-600">{clinic.city}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Vị trí</h3>
                            <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-3xl mb-2">🗺️</div>
                                    <p className="text-gray-600">Bản đồ tích hợp đang được phát triển</p>
                                </div>
                            </div>
                            <button className="mt-4 w-full px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50">
                                Xem chỉ đường
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Thống kê</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Bác sĩ</span>
                                    <span className="font-bold text-blue-600">{clinic.totalDoctors || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Đánh giá</span>
                                    <span className="font-bold text-yellow-600">{clinic.totalReviews}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Cuộc hẹn</span>
                                    <span className="font-bold text-green-600">{clinic.totalAppointments || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Hoạt động</span>
                                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${clinic.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {clinic.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}