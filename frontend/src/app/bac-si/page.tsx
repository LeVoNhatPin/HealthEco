'use client';

import { useState, useEffect } from 'react';
import { doctorService } from '@/services/doctor.service';
import { Doctor, Specialization } from '@/types/doctor';

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [specializations, setSpecializations] = useState<Specialization[]>([]);
    const [loading, setLoading] = useState(true);

    // filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState<number | undefined>();
    const [city, setCity] = useState('');
    const [minFee, setMinFee] = useState<number | undefined>();
    const [maxFee, setMaxFee] = useState<number | undefined>();

    // Load ALL doctors on first load
    useEffect(() => {
        loadSpecializations();
        loadDoctors();
    }, []);

    // Auto reload when filter changes
    useEffect(() => {
        const timeout = setTimeout(() => {
            loadDoctors();
        }, 400); // debounce nhẹ

        return () => clearTimeout(timeout);
    }, [searchTerm, selectedSpecialization, city, minFee, maxFee]);

    const loadDoctors = async () => {
        setLoading(true);
        try {
            const params = {
                searchTerm: searchTerm || undefined,
                specializationId: selectedSpecialization,
                city: city || undefined,
                minFee,
                maxFee,
            };

            const res = await doctorService.getDoctors(params);
            setDoctors(res.data || res);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const loadSpecializations = async () => {
        try {
            const res = await doctorService.getSpecializations();
            setSpecializations(res.data || res);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Danh sách bác sĩ</h1>
                    <p className="text-gray-600">
                        Chọn bác sĩ phù hợp và đặt lịch khám nhanh chóng
                    </p>
                </div>

                {/* FILTER BAR */}
                <div className="bg-white rounded-xl shadow p-4 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input
                        className="border rounded px-3 py-2"
                        placeholder="Tên bác sĩ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select
                        className="border rounded px-3 py-2"
                        value={selectedSpecialization || ''}
                        onChange={(e) =>
                            setSelectedSpecialization(
                                e.target.value ? Number(e.target.value) : undefined
                            )
                        }
                    >
                        <option value="">Tất cả chuyên khoa</option>
                        {specializations.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>

                    <input
                        className="border rounded px-3 py-2"
                        placeholder="Thành phố"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />

                    <input
                        type="number"
                        className="border rounded px-3 py-2"
                        placeholder="Phí từ"
                        value={minFee || ''}
                        onChange={(e) =>
                            setMinFee(e.target.value ? Number(e.target.value) : undefined)
                        }
                    />

                    <input
                        type="number"
                        className="border rounded px-3 py-2"
                        placeholder="Phí đến"
                        value={maxFee || ''}
                        onChange={(e) =>
                            setMaxFee(e.target.value ? Number(e.target.value) : undefined)
                        }
                    />
                </div>

                {/* DOCTOR LIST */}
                {loading ? (
                    <div className="text-center py-20">Đang tải bác sĩ...</div>
                ) : doctors.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        Không tìm thấy bác sĩ phù hợp
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doctor) => (
                            <div
                                key={doctor.id}
                                className="bg-white rounded-xl shadow hover:shadow-lg transition p-5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                                        👨‍⚕️
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            {doctor.user.fullName}
                                        </h3>
                                        <p className="text-blue-600 text-sm">
                                            {doctor.specialization?.name}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                                    {doctor.bio}
                                </p>

                                <div className="mt-4 flex justify-between items-center">
                                    <div className="font-semibold">
                                        {doctor.consultationFee.toLocaleString()} VNĐ
                                    </div>
                                    <a
                                        href={`/dat-lich?doctorId=${doctor.id}`}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Đặt lịch
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
