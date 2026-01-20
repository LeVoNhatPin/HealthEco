// frontend/src/app/phong-kham/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { clinicService } from '@/services/clinic.service';
import { MedicalFacility } from '@/types/clinic';
import Link from 'next/link';

const FACILITY_TYPES = [
    { value: '', label: 'Tất cả loại' },
    { value: 'HOSPITAL', label: 'Bệnh viện' },
    { value: 'CLINIC', label: 'Phòng khám' },
    { value: 'HOME_CLINIC', label: 'Phòng khám tại nhà' }
];

const CITIES = [
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ',
    'Huế',
    'Nha Trang',
    'Đà Lạt'
];

export default function ClinicsPage() {
    const [clinics, setClinics] = useState<MedicalFacility[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [facilityType, setFacilityType] = useState('');
    const [city, setCity] = useState('');
    const [services, setServices] = useState<string[]>([]);
    const [serviceInput, setServiceInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        loadClinics();
    }, [currentPage, searchTerm, facilityType, city]);

    const loadClinics = async () => {
        setLoading(true);
        try {
            const params = {
                searchTerm,
                facilityType: facilityType || undefined,
                city: city || undefined,
                service: services.length > 0 ? services[0] : undefined,
                page: currentPage,
                pageSize: 10
            };

            const response = await clinicService.getClinics(params);
            if (response.success) {
                setClinics(response.data);
                setTotalPages(response.data.pagination?.totalPages || 1);
                setTotalCount(response.data.pagination?.total || response.data.length || 0);
            }
        } catch (error) {
            console.error('Failed to load clinics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        loadClinics();
    };

    const handleReset = () => {
        setSearchTerm('');
        setFacilityType('');
        setCity('');
        setServices([]);
        setCurrentPage(1);
        setTimeout(() => loadClinics(), 0);
    };

    const addService = () => {
        if (serviceInput.trim() && !services.includes(serviceInput.trim())) {
            setServices([...services, serviceInput.trim()]);
            setServiceInput('');
        }
    };

    const removeService = (serviceToRemove: string) => {
        setServices(services.filter(service => service !== serviceToRemove));
    };

    const getFacilityTypeName = (type: string) => {
        switch (type) {
            case 'HOSPITAL': return 'Bệnh viện';
            case 'CLINIC': return 'Phòng khám';
            case 'HOME_CLINIC': return 'Phòng khám tại nhà';
            default: return type;
        }
    };

    const formatServices = (servicesJson: string) => {
        try {
            const servicesArray = JSON.parse(servicesJson);
            return Array.isArray(servicesArray) ? servicesArray.slice(0, 3) : [];
        } catch {
            return [];
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Tìm kiếm Cơ sở Y tế</h1>
                    <p className="text-lg text-gray-600">Tìm phòng khám và bệnh viện phù hợp với nhu cầu của bạn</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <form onSubmit={handleSearch}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Tên cơ sở, địa chỉ..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Loại cơ sở</label>
                                <select
                                    value={facilityType}
                                    onChange={(e) => setFacilityType(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {FACILITY_TYPES.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Thành phố</label>
                                <select
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Tất cả thành phố</option>
                                    {CITIES.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Dịch vụ</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={serviceInput}
                                        onChange={(e) => setServiceInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nhập dịch vụ..."
                                    />
                                    <button
                                        type="button"
                                        onClick={addService}
                                        className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {services.length > 0 && (
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    {services.map((service) => (
                                        <div
                                            key={service}
                                            className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg"
                                        >
                                            <span>{service}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeService(service)}
                                                className="ml-2 text-blue-500 hover:text-blue-700"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Đặt lại
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Tìm kiếm
                            </button>
                        </div>
                    </form>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="mt-4 text-gray-600">Đang tải danh sách cơ sở y tế...</p>
                    </div>
                ) : clinics.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow">
                        <p className="text-gray-600">Không tìm thấy cơ sở y tế nào phù hợp.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clinics.map((clinic) => (
                                <div
                                    key={clinic.id}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="h-48 bg-gradient-to-r from-blue-400 to-cyan-400 relative">
                                        {clinic.bannerUrl ? (
                                            <img
                                                src={clinic.bannerUrl}
                                                alt={clinic.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-4xl">🏥</span>
                                            </div>
                                        )}
                                        {clinic.isVerified && (
                                            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                ✅ Đã xác minh
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-start mb-4">
                                            {clinic.avatarUrl ? (
                                                <img
                                                    src={clinic.avatarUrl}
                                                    alt={clinic.name}
                                                    className="w-16 h-16 rounded-full border-4 border-white -mt-10 shadow-md"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full border-4 border-white -mt-10 shadow-md bg-blue-100 flex items-center justify-center">
                                                    <span className="text-2xl">🏥</span>
                                                </div>
                                            )}
                                            <div className="ml-4 flex-1">
                                                <h3 className="text-xl font-bold text-gray-900">{clinic.name}</h3>
                                                <div className="flex items-center mt-1">
                                                    <span className="text-yellow-400">★★★★★</span>
                                                    <span className="ml-2 text-gray-600">
                                                        {clinic.rating.toFixed(1)} ({clinic.totalReviews} đánh giá)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center text-gray-600">
                                                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <span>{getFacilityTypeName(clinic.facilityType)}</span>
                                            </div>

                                            <div className="flex items-center text-gray-600">
                                                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>{clinic.city}</span>
                                            </div>

                                            <div className="flex items-center text-gray-600">
                                                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span>{clinic.totalDoctors || 0} bác sĩ</span>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <div className="flex flex-wrap gap-2">
                                                {formatServices(clinic.services || '[]').map((service: string, index: number) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                                                    >
                                                        {service}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-6 flex space-x-3">
                                            <Link
                                                href={`/phong-kham/${clinic.id}`}
                                                className="flex-1 px-4 py-2 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                Xem chi tiết
                                            </Link>
                                            <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors">
                                                Đặt lịch
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <nav className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        ←
                                    </button>

                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`px-4 py-2 border rounded-lg ${currentPage === pageNum ? 'bg-blue-500 text-white border-blue-500' : 'hover:bg-gray-50'}`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        →
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}