"use client";

import { useState, useEffect } from "react";
import { doctorService } from "@/services/doctor.service";
import { scheduleService } from "@/services/schedule.service";
import { appointmentService } from "@/services/appointment.service";

const formatDateYMD = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

export default function BookingPage() {
    const [step, setStep] = useState(1);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [symptoms, setSymptoms] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        doctorService.getDoctors().then(res => {
            setDoctors(res.data || []);
        });
    }, []);

    const handleDateChange = async (dateStr: string) => {
        if (!selectedDoctor) return;

        setSelectedDate(dateStr);
        setLoading(true);
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

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Đặt lịch khám</h1>

            {step === 1 && (
                <div className="grid md:grid-cols-2 gap-4">
                    {doctors.map((d) => (
                        <div
                            key={d.id}
                            className="border rounded-lg p-4 cursor-pointer hover:shadow"
                            onClick={() => {
                                setSelectedDoctor(d);
                                setStep(2);
                            }}
                        >
                            <h3 className="font-semibold">{d.user.fullName}</h3>
                            <p className="text-sm text-gray-600">
                                {d.specialization?.name}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {step === 2 && (
                <div>
                    <h2 className="font-semibold mb-4">Chọn ngày khám</h2>

                    {/* DATE PICKER MỚI */}
                    <input
                        type="date"
                        min={formatDateYMD(new Date())}
                        value={selectedDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="border rounded px-4 py-2"
                    />

                    {selectedDate && (
                        <h3 className="mt-4 font-medium">
                            Giờ khám có sẵn ngày {formatDateVN(selectedDate)}
                        </h3>
                    )}

                    {loading && <p className="mt-4">Đang tải giờ khám...</p>}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                        {availableSlots
                            .filter(s => s.isAvailable)
                            .map((slot, i) => (
                                <button
                                    key={i}
                                    className={`border rounded p-3 ${selectedSlot?.startTime === slot.startTime
                                            ? "border-primary bg-blue-50"
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

            {step === 3 && (
                <div>
                    <h2 className="font-semibold mb-4">Xác nhận lịch</h2>

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
                        className="mt-4 bg-primary text-white px-6 py-2 rounded"
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
