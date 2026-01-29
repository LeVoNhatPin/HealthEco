"use client";

import { useState, useEffect } from "react";
import { doctorService } from "@/services/doctor.service";
import { scheduleService } from "@/services/schedule.service";
import { appointmentService } from "@/services/appointment.service";

export default function BookingPage() {
    const [step, setStep] = useState(1);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [symptoms, setSymptoms] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(true);

    // Step 1: Load doctors
    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await doctorService.getDoctors();
            setDoctors(response.data || []);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setLoadingDoctors(false);
        }
    };

    const handleSelectDoctor = (doctor: any) => {
        setSelectedDoctor(doctor);
        setStep(2);
    };

    const handleDateSelect = async (date: string) => {
        if (!selectedDoctor) return;

        setSelectedDate(date);
        setLoading(true);
        try {
            // Assuming facilityId is 1 for now
            const slots = await scheduleService.getAvailableSlots(
                selectedDoctor.id,
                1,
                date
            );

            setAvailableSlots(slots || []);

        } catch (error) {
            console.error("Error fetching slots:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSlotSelect = (slot: any) => {
        setSelectedSlot(slot);
        setStep(3);
    };

    const handleSubmitBooking = async () => {
        if (!selectedDoctor || !selectedDate || !selectedSlot) {
            alert("Vui lòng chọn đầy đủ thông tin");
            return;
        }

        try {
            const appointmentData = {
                doctorId: selectedDoctor.id,
                facilityId: 1, // Default facility for now
                appointmentDate: selectedDate,
                startTime: selectedSlot.startTime,
                symptoms: symptoms,
            };

            const result = await appointmentService.bookAppointment(appointmentData);

            if (result.success) {
                setStep(4); // Success step
            } else {
                alert(result.message || "Có lỗi xảy ra");
            }
        } catch (error: any) {
            alert(error.message || "Có lỗi xảy ra khi đặt lịch");
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Chọn bác sĩ</h2>
                        {loadingDoctors ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-4 text-gray-600">Đang tải danh sách bác sĩ...</p>
                            </div>
                        ) : doctors.length === 0 ? (
                            <p className="text-gray-500">Không có bác sĩ nào</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {doctors.map((doctor) => (
                                    <div
                                        key={doctor.id}
                                        className="border rounded-lg p-6 hover:shadow-lg cursor-pointer transition-shadow"
                                        onClick={() => handleSelectDoctor(doctor)}
                                    >
                                        <div className="flex items-start mb-4">
                                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                                                {doctor.user.avatarUrl ? (
                                                    <img
                                                        src={doctor.user.avatarUrl}
                                                        alt={doctor.user.fullName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-2xl text-gray-600">
                                                        {doctor.user.fullName.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">
                                                    {doctor.user.fullName}
                                                </h3>
                                                <p className="text-primary text-sm">
                                                    {doctor.specialization?.name || "Chuyên khoa"}
                                                </p>
                                                <div className="flex items-center mt-1">
                                                    <span className="text-yellow-500">★</span>
                                                    <span className="ml-1 font-medium">
                                                        {doctor.rating.toFixed(1)}
                                                    </span>
                                                    <span className="ml-2 text-gray-500 text-sm">
                                                        ({doctor.totalReviews} đánh giá)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex justify-between">
                                                <span>Kinh nghiệm:</span>
                                                <span className="font-medium">
                                                    {doctor.yearsExperience} năm
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Phí khám:</span>
                                                <span className="font-medium text-primary">
                                                    {doctor.consultationFee.toLocaleString()} VNĐ
                                                </span>
                                            </div>
                                            {doctor.user.city && (
                                                <div className="flex justify-between">
                                                    <span>Địa điểm:</span>
                                                    <span>{doctor.user.city}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4 text-center">
                                            <button className="text-primary font-medium hover:underline">
                                                Chọn bác sĩ này →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 2:
                return (
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Chọn ngày và giờ khám</h2>

                        {selectedDoctor && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                        {selectedDoctor.user.avatarUrl ? (
                                            <img
                                                src={selectedDoctor.user.avatarUrl}
                                                alt={selectedDoctor.user.fullName}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-lg">
                                                {selectedDoctor.user.fullName.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{selectedDoctor.user.fullName}</h3>
                                        <p className="text-sm text-gray-600">
                                            {selectedDoctor.specialization?.name} • {selectedDoctor.consultationFee.toLocaleString()} VNĐ
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Date Selection */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium mb-3">
                                Chọn ngày khám
                            </label>
                            <div className="flex gap-3">
                                {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                                    const date = new Date();
                                    date.setDate(date.getDate() + offset);
                                    const dateStr = date.toISOString().split("T")[0];
                                    const isSelected = selectedDate === dateStr;

                                    return (
                                        <button
                                            key={offset}
                                            onClick={() => handleDateSelect(dateStr)}
                                            className={`flex-1 text-center py-3 rounded-lg border ${isSelected
                                                ? "border-primary bg-primary text-white"
                                                : "border-gray-300 hover:border-primary hover:bg-blue-50"
                                                }`}
                                        >
                                            <div className="text-sm">
                                                {date.toLocaleDateString("vi-VN", { weekday: "short" })}
                                            </div>
                                            <div className="font-semibold">{date.getDate()}</div>
                                            <div className="text-xs">
                                                {date.toLocaleDateString("vi-VN", { month: "short" })}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Slots */}
                        {selectedDate && (
                            <div>
                                <h3 className="text-lg font-medium mb-4">
                                    Giờ khám có sẵn ngày {formatDate(selectedDate)}
                                </h3>
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                        <p className="mt-2 text-gray-600">Đang tải giờ khám...</p>
                                    </div>
                                ) : availableSlots.length === 0 ? (
                                    <div className="text-center py-8 border rounded-lg">
                                        <p className="text-gray-500">Không có giờ khám trống vào ngày này</p>
                                        <button
                                            onClick={() => setStep(1)}
                                            className="mt-4 text-primary hover:underline"
                                        >
                                            ← Chọn ngày khác
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                                            {availableSlots
                                                .filter((slot) => slot.isAvailable)
                                                .map((slot, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSlotSelect(slot)}
                                                        className={`p-4 border rounded-lg text-center transition ${selectedSlot?.startTime === slot.startTime
                                                            ? "border-primary bg-blue-50"
                                                            : "border-gray-300 hover:border-primary hover:bg-blue-50"
                                                            }`}
                                                    >
                                                        <div className="font-medium text-lg">
                                                            {slot.startTime}
                                                        </div>
                                                        <div className="text-sm text-gray-600">- {slot.endTime} -</div>
                                                        <div className="text-sm text-green-600 mt-1">Còn trống</div>
                                                    </button>
                                                ))}
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setStep(1)}
                                                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                                            >
                                                ← Quay lại chọn bác sĩ
                                            </button>
                                            <button
                                                onClick={() => handleDateSelect(selectedDate)}
                                                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                                            >
                                                ↻ Làm mới giờ khám
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );

            case 3:
                return (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-xl font-semibold mb-6">Xác nhận đặt lịch</h2>

                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <h3 className="font-semibold text-lg mb-4">Thông tin lịch hẹn</h3>

                            <div className="space-y-4">
                                <div className="flex items-center p-3 bg-white rounded-lg">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                        {selectedDoctor?.user.avatarUrl ? (
                                            <img
                                                src={selectedDoctor.user.avatarUrl}
                                                alt={selectedDoctor.user.fullName}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-sm">
                                                {selectedDoctor?.user.fullName.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium">{selectedDoctor?.user.fullName}</div>
                                        <div className="text-sm text-gray-600">
                                            {selectedDoctor?.specialization?.name}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded-lg">
                                        <div className="text-sm text-gray-600">Ngày khám</div>
                                        <div className="font-medium">{formatDate(selectedDate)}</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                        <div className="text-sm text-gray-600">Giờ khám</div>
                                        <div className="font-medium">
                                            {selectedSlot?.startTime} - {selectedSlot?.endTime}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-3 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-1">Phí khám</div>
                                    <div className="text-xl font-semibold text-primary">
                                        {selectedDoctor?.consultationFee.toLocaleString()} VNĐ
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-medium mb-3">
                                Triệu chứng / Lý do khám (tùy chọn)
                            </label>
                            <textarea
                                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                                rows={4}
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                placeholder="Mô tả triệu chứng hoặc lý do khám..."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 px-4 py-3 border rounded-lg text-gray-600 hover:bg-gray-50"
                            >
                                ← Quay lại chọn giờ
                            </button>
                            <button
                                onClick={handleSubmitBooking}
                                className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition"
                            >
                                Xác nhận đặt lịch
                            </button>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="max-w-md mx-auto text-center py-12">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl text-green-600">✓</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Đặt lịch thành công!</h2>
                        <p className="text-gray-600 mb-8">
                            Lịch khám của bạn đã được xác nhận. Vui lòng đến đúng giờ hẹn và mang theo CMND/CCCD.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    setStep(1);
                                    setSelectedDoctor(null);
                                    setSelectedDate("");
                                    setSelectedSlot(null);
                                    setSymptoms("");
                                }}
                                className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition"
                            >
                                Đặt lịch mới
                            </button>
                            <button
                                onClick={() => (window.location.href = "/bang-dieu-khien")}
                                className="w-full border border-primary text-primary py-3 px-4 rounded-lg hover:bg-blue-50 transition"
                            >
                                Xem lịch hẹn của tôi
                            </button>
                            <button
                                onClick={() => (window.location.href = "/")}
                                className="w-full border border-gray-300 text-gray-600 py-3 px-4 rounded-lg hover:bg-gray-50 transition"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-8">Đặt lịch khám</h1>

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex justify-between relative">
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
                    {[1, 2, 3, 4].map((stepNum) => (
                        <div
                            key={stepNum}
                            className="flex flex-col items-center relative z-10"
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= stepNum
                                    ? "bg-primary text-white"
                                    : "bg-gray-200 text-gray-400"
                                    }`}
                            >
                                {stepNum}
                            </div>
                            <span className="text-sm">
                                {stepNum === 1 && "Chọn bác sĩ"}
                                {stepNum === 2 && "Chọn giờ"}
                                {stepNum === 3 && "Xác nhận"}
                                {stepNum === 4 && "Hoàn thành"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            {getStepContent()}
        </div>
    );
}