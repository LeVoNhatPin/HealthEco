"use client";

import { useEffect, useState } from "react";
import { doctorService } from "@/services/doctor.service";
import { scheduleService } from "@/services/schedule.service";
import { appointmentService } from "@/services/appointment.service";

const formatDateYMD = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const formatDateVN = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(
        "vi-VN",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );
};

export default function BookingPage() {
    const [step, setStep] = useState(1);

    const [doctors, setDoctors] = useState<any[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
    const [specializations, setSpecializations] = useState<any[]>([]);

    const [search, setSearch] = useState("");
    const [specId, setSpecId] = useState("");

    // ===== PHÍ KHÁM =====
    const [minFee, setMinFee] = useState(0);
    const [maxFee, setMaxFee] = useState(1000000);

    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [symptoms, setSymptoms] = useState("");

    const [loading, setLoading] = useState(false);

    // ================= LOAD =================
    useEffect(() => {
        const load = async () => {
            const doctorRes = await doctorService.getDoctors();
            const specRes = await doctorService.getSpecializations();

            const doctorList = Array.isArray(doctorRes?.data)
                ? doctorRes.data
                : [];

            const specList = Array.isArray(specRes?.data)
                ? specRes.data
                : [];

            setDoctors(doctorList);
            setFilteredDoctors(doctorList);
            setSpecializations(specList);

            // Tự động set maxFee theo data
            const fees = doctorList.map((d: { consultationFee: any; }) => d.consultationFee || 0);
            setMaxFee(Math.max(...fees, 100000));
        };

        load();
    }, []);

    // ================= FILTER =================
    useEffect(() => {
        let result = [...doctors];

        if (search) {
            result = result.filter(d =>
                d.user.fullName.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (specId) {
            result = result.filter(
                d => String(d.specialization?.id) === specId
            );
        }

        result = result.filter(
            d =>
                (d.consultationFee || 0) >= minFee &&
                (d.consultationFee || 0) <= maxFee
        );

        setFilteredDoctors(result);
    }, [search, specId, minFee, maxFee, doctors]);

    // ================= DATE =================
    const handleDateChange = async (dateStr: string) => {
        if (!selectedDoctor) return;

        setSelectedDate(dateStr);
        setLoading(true);

        try {
            const res = await scheduleService.getAvailableSlots(
                selectedDoctor.id,
                1,
                dateStr
            );

            const slots = Array.isArray(res)
                ? res
                : Array.isArray(res?.data)
                ? res.data
                : [];

            setAvailableSlots(slots);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Đặt lịch khám</h1>

            {/* ================= STEP 1 ================= */}
            {step === 1 && (
                <>
                    {/* FILTER */}
                    <div className="bg-white p-4 rounded shadow mb-6 space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                            <input
                                className="border px-3 py-2 rounded"
                                placeholder="Tìm tên bác sĩ..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <select
                                className="border px-3 py-2 rounded"
                                value={specId}
                                onChange={(e) => setSpecId(e.target.value)}
                            >
                                <option value="">Tất cả chuyên khoa</option>
                                {specializations.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* ===== SLIDER PHÍ KHÁM ===== */}
                        <div>
                            <label className="font-medium">
                                Phí khám:{" "}
                                <span className="text-blue-600 font-semibold">
                                    {minFee.toLocaleString()} – {maxFee.toLocaleString()} VND
                                </span>
                            </label>

                            <div className="flex gap-4 mt-2">
                                <input
                                    type="range"
                                    min={0}
                                    max={2000000}
                                    step={50000}
                                    value={minFee}
                                    onChange={(e) =>
                                        setMinFee(Number(e.target.value))
                                    }
                                    className="w-full"
                                />

                                <input
                                    type="range"
                                    min={0}
                                    max={2000000}
                                    step={50000}
                                    value={maxFee}
                                    onChange={(e) =>
                                        setMaxFee(Number(e.target.value))
                                    }
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* DOCTOR LIST */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {filteredDoctors.map((d) => (
                            <div
                                key={d.id}
                                className="border rounded-lg p-4 hover:shadow cursor-pointer"
                                onClick={() => {
                                    setSelectedDoctor(d);
                                    setStep(2);
                                }}
                            >
                                <h3 className="font-semibold text-lg">
                                    {d.user.fullName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {d.specialization?.name}
                                </p>
                                <p className="text-sm mt-2">
                                    Phí khám:{" "}
                                    <b>
                                        {d.consultationFee?.toLocaleString()} VND
                                    </b>
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
                <div>
                    <button
                        className="mb-4 text-blue-500"
                        onClick={() => setStep(1)}
                    >
                        ← Chọn bác sĩ khác
                    </button>

                    <h2 className="font-semibold mb-4">
                        Chọn ngày khám – {selectedDoctor.user.fullName}
                    </h2>

                    <input
                        type="date"
                        min={formatDateYMD(new Date())}
                        value={selectedDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="border rounded px-4 py-2"
                    />

                    {loading && <p className="mt-4">Đang tải giờ khám...</p>}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                        {availableSlots
                            .filter((s) => s.isAvailable)
                            .map((slot, i) => (
                                <button
                                    key={i}
                                    className="border rounded p-3 hover:bg-blue-50"
                                    onClick={() => {
                                        setSelectedSlot(slot);
                                        setStep(3);
                                    }}
                                >
                                    {slot.startTime} - {slot.endTime}
                                </button>
                            ))}
                    </div>
                </div>
            )}

            {/* ================= STEP 3 ================= */}
            {step === 3 && (
                <div>
                    <h2 className="font-semibold mb-4">Xác nhận lịch khám</h2>

                    <p><b>Bác sĩ:</b> {selectedDoctor.user.fullName}</p>
                    <p><b>Ngày:</b> {formatDateVN(selectedDate)}</p>
                    <p><b>Giờ:</b> {selectedSlot.startTime} - {selectedSlot.endTime}</p>

                    <textarea
                        className="w-full border rounded mt-4 p-3"
                        placeholder="Triệu chứng..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                    />

                    <button
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
                        onClick={async () => {
                            await appointmentService.bookAppointment({
                                doctorId: selectedDoctor.id,
                                facilityId: 1,
                                appointmentDate: selectedDate,
                                startTime: selectedSlot.startTime,
                                symptoms,
                            });
                            setStep(4);
                        }}
                    >
                        Xác nhận đặt lịch
                    </button>
                </div>
            )}

            {/* ================= STEP 4 ================= */}
            {step === 4 && (
                <div className="text-center">
                    <h2 className="text-green-600 text-xl font-bold">
                        ✅ Đặt lịch thành công
                    </h2>
                </div>
            )}
        </div>
    );
}
