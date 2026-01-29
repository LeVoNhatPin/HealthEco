"use client";

import { useEffect, useState } from "react";
import { doctorService } from "@/services/doctor.service";
import { scheduleService } from "@/services/schedule.service";
import { appointmentService } from "@/services/appointment.service";

/* ================== UTILS ================== */
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

/* ================== PAGE ================== */
export default function BookingPage() {
    const [step, setStep] = useState(1);

    const [doctors, setDoctors] = useState<any[]>([]);
    const [specializations, setSpecializations] = useState<any[]>([]);

    const [search, setSearch] = useState("");
    const [selectedSpec, setSelectedSpec] = useState("");

    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [symptoms, setSymptoms] = useState("");

    const [loading, setLoading] = useState(false);

    /* ================== LOAD DATA ================== */
    useEffect(() => {
        const loadData = async () => {
            const doctorRes = await doctorService.getDoctors();
            const specRes = await doctorService.getSpecializations();

            setDoctors(doctorRes.data || []);
            setSpecializations(specRes || []);
        };

        loadData();
    }, []);

    /* ================== FILTER ================== */
    const filteredDoctors = doctors.filter((d) => {
        const matchName = d.user.fullName
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchSpec = selectedSpec
            ? d.specialization?.id === Number(selectedSpec)
            : true;

        return matchName && matchSpec;
    });

    /* ================== HANDLERS ================== */
    const handleDateChange = async (dateStr: string) => {
        if (!selectedDoctor) return;

        setSelectedDate(dateStr);
        setLoading(true);
        setAvailableSlots([]);

        try {
            const slots = await scheduleService.getAvailableSlots(
                selectedDoctor.id,
                1,
                dateStr
            );
            setAvailableSlots(slots || []);
        } finally {
            setLoading(false);
        }
    };

    /* ================== UI ================== */
    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <h1 className="text-2xl font-bold mb-6">Đặt lịch khám</h1>

            {/* ================== STEP 1: CHỌN BÁC SĨ ================== */}
            {step === 1 && (
                <div>
                    {/* FILTER */}
                    <div className="flex flex-col md:flex-row gap-3 mb-5">
                        <input
                            type="text"
                            placeholder="🔍 Tìm bác sĩ theo tên..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border rounded px-4 py-2 flex-1"
                        />

                        <select
                            value={selectedSpec}
                            onChange={(e) =>
                                setSelectedSpec(e.target.value)
                            }
                            className="border rounded px-4 py-2"
                        >
                            <option value="">
                                Tất cả chuyên khoa
                            </option>
                            {specializations.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* LIST */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {filteredDoctors.map((d) => (
                            <div
                                key={d.id}
                                className="border rounded-lg p-4 cursor-pointer hover:shadow transition"
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
                                {d.bio && (
                                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                        {d.bio}
                                    </p>
                                )}
                            </div>
                        ))}

                        {filteredDoctors.length === 0 && (
                            <p className="text-gray-500">
                                Không tìm thấy bác sĩ phù hợp 😢
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* ================== STEP 2: CHỌN NGÀY + GIỜ ================== */}
            {step === 2 && (
                <div>
                    <button
                        className="text-sm text-blue-600 mb-3"
                        onClick={() => setStep(1)}
                    >
                        ← Đổi bác sĩ
                    </button>

                    <h2 className="font-semibold mb-2">
                        {selectedDoctor.user.fullName}
                    </h2>

                    <input
                        type="date"
                        min={formatDateYMD(new Date())}
                        value={selectedDate}
                        onChange={(e) =>
                            handleDateChange(e.target.value)
                        }
                        className="border rounded px-4 py-2"
                    />

                    {selectedDate && (
                        <h3 className="mt-4 font-medium">
                            Giờ khám ngày{" "}
                            {formatDateVN(selectedDate)}
                        </h3>
                    )}

                    {loading && (
                        <p className="mt-4">
                            Đang tải giờ khám...
                        </p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                        {availableSlots
                            .filter((s) => s.isAvailable)
                            .map((slot, i) => (
                                <button
                                    key={i}
                                    className={`border rounded p-3 ${
                                        selectedSlot?.startTime ===
                                        slot.startTime
                                            ? "border-blue-500 bg-blue-50"
                                            : ""
                                    }`}
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

            {/* ================== STEP 3: XÁC NHẬN ================== */}
            {step === 3 && (
                <div>
                    <h2 className="font-semibold mb-4">
                        Xác nhận lịch khám
                    </h2>

                    <p>
                        <b>Bác sĩ:</b>{" "}
                        {selectedDoctor.user.fullName}
                    </p>
                    <p>
                        <b>Ngày:</b>{" "}
                        {formatDateVN(selectedDate)}
                    </p>
                    <p>
                        <b>Giờ:</b>{" "}
                        {selectedSlot.startTime} -{" "}
                        {selectedSlot.endTime}
                    </p>

                    <textarea
                        className="w-full border rounded mt-4 p-3"
                        placeholder="Triệu chứng..."
                        value={symptoms}
                        onChange={(e) =>
                            setSymptoms(e.target.value)
                        }
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

            {/* ================== STEP 4: DONE ================== */}
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
