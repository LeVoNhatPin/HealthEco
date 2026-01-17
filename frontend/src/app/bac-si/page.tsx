// app/bac-si/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { doctorService } from '@/services/doctor.service';
import { Doctor, Specialization } from '@/types/doctor';

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [specializations, setSpecializations] = useState<Specialization[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState<number | undefined>();
    const [city, setCity] = useState('');
    const [minFee, setMinFee] = useState<number | undefined>();
    const [maxFee, setMaxFee] = useState<number | undefined>();

    useEffect(() => {
        loadDoctors();
        loadSpecializations();
    }, []);

    const loadDoctors = async () => {
        setLoading(true);
        try {
            const params = {
                searchTerm,
                specializationId: selectedSpecialization,
                city,
                minFee,
                maxFee
            };
            const response = await doctorService.getDoctors(params);
            if (response.success) {
                setDoctors(response.data);
            }
        } catch (error) {
            console.error('Failed to load doctors', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSpecializations = async () => {
        try {
            const response = await doctorService.getSpecializations();
            if (response.success) {
                setSpecializations(response.data);
            }
        } catch (error) {
            console.error('Failed to load specializations', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadDoctors();
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedSpecialization(undefined);
        setCity('');
        setMinFee(undefined);
        setMaxFee(undefined);
        // Gọi loadDoctors ngay sau khi reset state không đảm bảo state đã được cập nhật, nên chúng ta cần đợi một chút
        setTimeout(() => loadDoctors(), 0);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Danh sách Bác sĩ</h1>
                    <p className="text-lg text-gray-600">Tìm kiếm và đặt lịch với các bác sĩ chuyên nghiệp</p>
                </div>

                {/* Search and filter section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <form onSubmit={handleSearch}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Tên bác sĩ, chuyên khoa..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên khoa</label>
                                <select
                                    value={selectedSpecialization || ''}
                                    onChange={(e) => setSelectedSpecialization(e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Tất cả chuyên khoa</option>
                                    {specializations.map((spec) => (
                                        <option key={spec.id} value={spec.id}>
                                            {spec.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Thành phố</label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="VD: Hà Nội"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mức phí (VND)</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        value={minFee || ''}
                                        onChange={(e) => setMinFee(e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
                                        placeholder="Từ"
                                    />
                                    <input
                                        type="number"
                                        value={maxFee || ''}
                                        onChange={(e) => setMaxFee(e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
                                        placeholder="Đến"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Đặt lại
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Tìm kiếm
                            </button>
                        </div>
                    </form>
                </div>

                {/* Doctors list */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="mt-4 text-gray-600">Đang tải danh sách bác sĩ...</p>
                    </div>
                ) : doctors.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow">
                        <p className="text-gray-600">Không tìm thấy bác sĩ nào phù hợp.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doctor) => (
                            <div key={doctor.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-2xl text-blue-500">👨‍⚕️</span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-xl font-bold text-gray-900">{doctor.user.fullName}</h3>
                                            <p className="text-blue-600 font-medium">{doctor.specialization?.name}</p>
                                            <div className="flex items-center mt-1">
                                                <span className="text-yellow-400">★★★★★</span>
                                                <span className="ml-2 text-gray-600">({doctor.rating})</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-gray-600 line-clamp-2">{doctor.bio}</p>
                                    </div>
                                    <div className="mt-6 flex justify-between items-center">
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{doctor.consultationFee.toLocaleString()} VND</p>
                                            <p className="text-gray-500 text-sm">/ lượt tư vấn</p>
                                        </div>
                                        <a
                                            href={`/bac-si/${doctor.id}`}
                                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            Xem chi tiết
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}