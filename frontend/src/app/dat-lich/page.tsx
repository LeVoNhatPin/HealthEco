"use client";

import { useState, useEffect } from "react";
import { doctorService } from "@/services/doctor.service";
import { scheduleService } from "@/services/schedule.service";
import { appointmentService } from "@/services/appointment.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
    ChevronRight,
    Calendar,
    Clock,
    User,
    Stethoscope,
    MapPin,
    Star,
    CheckCircle,
    ArrowLeft,
    RefreshCw,
    Award,
    Shield,
    Sparkles
} from "lucide-react";
import { mockDoctors } from "@/services/mock.data";

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
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Generate next 7 days for date selection
    const getNext7Days = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const days = getNext7Days();

    // Step 1: Load doctors
    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoadingDoctors(true);
            // Use mock data for now
            setDoctors(mockDoctors);
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
            // Generate mock available slots
            const mockSlots = [
                { id: 1, startTime: "08:00", endTime: "08:30", isAvailable: true },
                { id: 2, startTime: "09:00", endTime: "09:30", isAvailable: true },
                { id: 3, startTime: "10:00", endTime: "10:30", isAvailable: true },
                { id: 4, startTime: "11:00", endTime: "11:30", isAvailable: true },
                { id: 5, startTime: "14:00", endTime: "14:30", isAvailable: true },
                { id: 6, startTime: "15:00", endTime: "15:30", isAvailable: true },
                { id: 7, startTime: "16:00", endTime: "16:30", isAvailable: true },
            ];
            setAvailableSlots(mockSlots);
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
            setLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setBookingSuccess(true);
            setStep(4);
        } catch (error: any) {
            alert(error.message || "Có lỗi xảy ra khi đặt lịch");
        } finally {
            setLoading(false);
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

    const getDayName = (date: Date) => {
        return date.toLocaleDateString("vi-VN", { weekday: "short" });
    };

    const getMonthName = (date: Date) => {
        return date.toLocaleDateString("vi-VN", { month: "short" });
    };

    // Step Progress Component
    const StepProgress = () => (
        <div className="mb-12">
            <div className="flex items-center justify-between relative max-w-3xl mx-auto">
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
                {[1, 2, 3, 4].map((stepNum) => (
                    <div key={stepNum} className="flex flex-col items-center relative z-10">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${step >= stepNum
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                            : "bg-white border-2 border-gray-300 text-gray-400"
                            }`}>
                            {step >= stepNum ? (
                                <CheckCircle className="h-6 w-6" />
                            ) : (
                                <span className="font-semibold">{stepNum}</span>
                            )}
                        </div>
                        <span className={`text-sm font-medium ${step >= stepNum ? "text-gray-900" : "text-gray-500"}`}>
                            {stepNum === 1 && "Chọn bác sĩ"}
                            {stepNum === 2 && "Chọn giờ"}
                            {stepNum === 3 && "Xác nhận"}
                            {stepNum === 4 && "Hoàn thành"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Đặt Lịch Khám
                        </span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Chọn bác sĩ phù hợp và đặt lịch khám nhanh chóng, tiện lợi với HealthEco
                    </p>
                </div>

                {/* Step Progress */}
                <StepProgress />

                {/* Step Content */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
                    {/* Step 1: Choose Doctor */}
                    {step === 1 && (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Chọn Bác Sĩ Phù Hợp
                                    </h2>
                                    <p className="text-gray-600">
                                        {doctors.length} bác sĩ có sẵn
                                    </p>
                                </div>
                                <div className="hidden md:block">
                                    <Badge className="bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200 px-4 py-2">
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Được đánh giá cao
                                    </Badge>
                                </div>
                            </div>

                            {loadingDoctors ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Đang tải danh sách bác sĩ...</p>
                                </div>
                            ) : doctors.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
                                    <p className="text-gray-600 mb-4">Hiện chưa có bác sĩ nào</p>
                                    <Button onClick={fetchDoctors}>
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Thử lại
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {doctors.map((doctor) => (
                                        <Card
                                            key={doctor.id}
                                            className="group cursor-pointer border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50"
                                            onClick={() => handleSelectDoctor(doctor)}
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex items-start mb-4">
                                                    <Avatar className="h-16 w-16 border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
                                                        <AvatarImage src={doctor.user.avatarUrl} alt={doctor.user.fullName} />
                                                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                                            {doctor.user.fullName
                                                                .split(' ')
                                                                .map((n: string) => n[0])
                                                                .join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="ml-4 flex-1">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                                                    {doctor.user.fullName}
                                                                </h3>
                                                                <div className="flex items-center mt-1">
                                                                    <Badge className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200">
                                                                        {doctor.specialization?.name}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center bg-gradient-to-r from-amber-100 to-amber-50 px-2 py-1 rounded-full">
                                                                <Star className="h-4 w-4 text-amber-500 fill-current" />
                                                                <span className="ml-1 font-bold">{doctor.rating}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center text-sm text-gray-600 mt-3 space-x-4">
                                                            <div className="flex items-center">
                                                                <Award className="h-4 w-4 mr-1 text-blue-500" />
                                                                <span>{doctor.experience} năm</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <MapPin className="h-4 w-4 mr-1 text-red-500" />
                                                                <span className="truncate max-w-[100px]">{doctor.clinic}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <p className="text-gray-600 text-sm line-clamp-2">
                                                        {doctor.bio}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t">
                                                    <div>
                                                        <div className="text-2xl font-bold text-gray-900">
                                                            {doctor.consultationFee.toLocaleString()} VNĐ
                                                        </div>
                                                        <div className="text-sm text-gray-500">/ lượt khám</div>
                                                    </div>
                                                    <Button className="bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-indigo-600">
                                                        Chọn bác sĩ
                                                        <ChevronRight className="h-4 w-4 ml-2" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Choose Date & Time */}
                    {step === 2 && (
                        <div>
                            <div className="mb-8">
                                <Button
                                    variant="ghost"
                                    onClick={() => setStep(1)}
                                    className="mb-6 text-gray-600 hover:text-blue-600"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Quay lại chọn bác sĩ
                                </Button>

                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
                                    <div className="flex items-center">
                                        <Avatar className="h-14 w-14 border-4 border-white shadow">
                                            <AvatarImage src={selectedDoctor?.user?.avatarUrl} alt={selectedDoctor?.user?.fullName} />
                                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                                {selectedDoctor?.user?.fullName
                                                    ?.split(' ')
                                                    .map((n: string) => n[0])
                                                    .join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4">
                                            <h3 className="text-xl font-bold text-gray-900">{selectedDoctor?.user?.fullName}</h3>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Badge className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800">
                                                    {selectedDoctor?.specialization?.name}
                                                </Badge>
                                                <div className="flex items-center">
                                                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                                                    <span className="ml-1 font-medium">{selectedDoctor?.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Chọn Thời Gian Khám
                                </h2>

                                {/* Date Selection */}
                                <div className="mb-10">
                                    <div className="flex items-center mb-4">
                                        <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                                        <h3 className="text-lg font-semibold">Chọn ngày khám</h3>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                                        {days.map((date, index) => {
                                            const dateStr = date.toISOString().split("T")[0];
                                            const isSelected = selectedDate === dateStr;
                                            const isToday = index === 0;

                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => handleDateSelect(dateStr)}
                                                    className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 ${isSelected
                                                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                                                        : "bg-white border hover:border-blue-300 hover:shadow-md"
                                                        }`}
                                                >
                                                    <div className={`text-sm font-medium ${isSelected ? "text-blue-100" : "text-gray-500"}`}>
                                                        {getDayName(date)}
                                                    </div>
                                                    <div className={`text-2xl font-bold my-1 ${isSelected ? "text-white" : "text-gray-900"}`}>
                                                        {date.getDate()}
                                                    </div>
                                                    <div className={`text-xs ${isSelected ? "text-blue-100" : "text-gray-500"}`}>
                                                        {getMonthName(date)}
                                                    </div>
                                                    {isToday && (
                                                        <div className={`mt-2 text-xs px-2 py-0.5 rounded-full ${isSelected ? "bg-white/20" : "bg-blue-100 text-blue-800"}`}>
                                                            Hôm nay
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Time Slots */}
                                {selectedDate && (
                                    <div>
                                        <div className="flex items-center mb-4">
                                            <Clock className="h-5 w-5 text-green-600 mr-2" />
                                            <h3 className="text-lg font-semibold">
                                                Giờ khám có sẵn - {formatDate(selectedDate)}
                                            </h3>
                                        </div>

                                        {loading ? (
                                            <div className="text-center py-12">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                                <p className="mt-2 text-gray-600">Đang tải giờ khám...</p>
                                            </div>
                                        ) : availableSlots.length === 0 ? (
                                            <Card className="text-center py-12">
                                                <div className="text-gray-400 text-5xl mb-4">⏰</div>
                                                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                                                    Không có giờ khám trống
                                                </h4>
                                                <p className="text-gray-500 mb-6">
                                                    Vui lòng chọn ngày khác hoặc liên hệ bác sĩ để được tư vấn
                                                </p>
                                                <Button variant="outline" onClick={() => setStep(1)}>
                                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                                    Chọn bác sĩ khác
                                                </Button>
                                            </Card>
                                        ) : (
                                            <>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                                                    {availableSlots
                                                        .filter((slot) => slot.isAvailable)
                                                        .map((slot, index) => (
                                                            <button
                                                                key={slot.id}
                                                                onClick={() => handleSlotSelect(slot)}
                                                                className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${selectedSlot?.id === slot.id
                                                                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105"
                                                                    : "bg-white border hover:border-blue-300 hover:shadow-md hover:scale-105"
                                                                    }`}
                                                            >
                                                                <div className={`text-2xl font-bold ${selectedSlot?.id === slot.id ? "text-white" : "text-gray-900"}`}>
                                                                    {slot.startTime}
                                                                </div>
                                                                <div className={`text-sm ${selectedSlot?.id === slot.id ? "text-blue-100" : "text-gray-500"}`}>
                                                                    - {slot.endTime} -
                                                                </div>
                                                                <Badge className={`mt-2 ${selectedSlot?.id === slot.id
                                                                    ? "bg-white/20 text-white"
                                                                    : "bg-green-100 text-green-800"
                                                                    }`}>
                                                                    Còn trống
                                                                </Badge>
                                                            </button>
                                                        ))}
                                                </div>

                                                <div className="flex justify-between">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setStep(1)}
                                                        className="border-gray-300"
                                                    >
                                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                                        Chọn bác sĩ khác
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDateSelect(selectedDate)}
                                                        variant="ghost"
                                                    >
                                                        <RefreshCw className="h-4 w-4 mr-2" />
                                                        Làm mới giờ khám
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                        <div className="max-w-3xl mx-auto">
                            <Button
                                variant="ghost"
                                onClick={() => setStep(2)}
                                className="mb-6 text-gray-600 hover:text-blue-600"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Quay lại chọn giờ
                            </Button>

                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                    Xác Nhận Đặt Lịch
                                </h2>
                                <p className="text-gray-600">
                                    Vui lòng kiểm tra thông tin trước khi xác nhận
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column - Appointment Details */}
                                <div className="lg:col-span-2">
                                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-lg">
                                        <CardContent className="p-8">
                                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                                <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                                                Thông Tin Lịch Hẹn
                                            </h3>

                                            <div className="space-y-6">
                                                {/* Doctor Info */}
                                                <div className="flex items-center p-4 bg-white rounded-xl shadow-sm">
                                                    <Avatar className="h-16 w-16 border-4 border-white">
                                                        <AvatarImage src={selectedDoctor?.user?.avatarUrl} />
                                                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                                            {selectedDoctor?.user?.fullName
                                                                ?.split(' ')
                                                                .map((n: string) => n[0])
                                                                .join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="ml-4">
                                                        <h4 className="font-bold text-lg">{selectedDoctor?.user?.fullName}</h4>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <Badge className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800">
                                                                {selectedDoctor?.specialization?.name}
                                                            </Badge>
                                                            <div className="flex items-center">
                                                                <Star className="h-4 w-4 text-amber-500 fill-current" />
                                                                <span className="ml-1">{selectedDoctor?.rating}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Date & Time */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                                        <div className="flex items-center text-gray-600 mb-2">
                                                            <Calendar className="h-5 w-5 mr-2" />
                                                            Ngày khám
                                                        </div>
                                                        <div className="text-lg font-bold text-gray-900">
                                                            {formatDate(selectedDate)}
                                                        </div>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                                        <div className="flex items-center text-gray-600 mb-2">
                                                            <Clock className="h-5 w-5 mr-2" />
                                                            Giờ khám
                                                        </div>
                                                        <div className="text-lg font-bold text-gray-900">
                                                            {selectedSlot?.startTime} - {selectedSlot?.endTime}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Clinic & Fee */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                                        <div className="flex items-center text-gray-600 mb-2">
                                                            <MapPin className="h-5 w-5 mr-2" />
                                                            Địa điểm
                                                        </div>
                                                        <div className="font-medium text-gray-900">
                                                            {selectedDoctor?.clinic}
                                                        </div>
                                                    </div>
                                                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl shadow-lg">
                                                        <div className="mb-2">Phí khám</div>
                                                        <div className="text-2xl font-bold">
                                                            {selectedDoctor?.consultationFee.toLocaleString()} VNĐ
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Right Column - Symptoms & Confirmation */}
                                <div>
                                    <Card className="border-none shadow-lg h-full">
                                        <CardContent className="p-6">
                                            <h4 className="font-bold text-lg mb-4 flex items-center">
                                                <User className="h-5 w-5 text-blue-600 mr-2" />
                                                Thông Tin Bổ Sung
                                            </h4>

                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    Triệu chứng / Lý do khám
                                                </label>
                                                <Textarea
                                                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
                                                    placeholder="Mô tả triệu chứng, lý do khám hoặc thông tin cần thiết cho bác sĩ..."
                                                    value={symptoms}
                                                    onChange={(e) => setSymptoms(e.target.value)}
                                                />
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Không bắt buộc, nhưng sẽ giúp bác sĩ chuẩn bị tốt hơn
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Shield className="h-4 w-4 text-green-500 mr-2" />
                                                    <span>Thông tin được bảo mật theo tiêu chuẩn HIPAA</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Clock className="h-4 w-4 text-amber-500 mr-2" />
                                                    <span>Vui lòng đến trước 15 phút để hoàn tất thủ tục</span>
                                                </div>
                                            </div>

                                            <div className="mt-8 space-y-4">
                                                <Button
                                                    onClick={handleSubmitBooking}
                                                    disabled={loading}
                                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 text-lg font-semibold shadow-lg"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                            Đang xử lý...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Xác Nhận Đặt Lịch
                                                            <CheckCircle className="h-5 w-5 ml-2" />
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setStep(2)}
                                                    className="w-full border-gray-300"
                                                >
                                                    Quay lại chỉnh sửa
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="max-w-2xl mx-auto text-center py-12">
                            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                                <CheckCircle className="h-12 w-12 text-white" />
                            </div>

                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                🎉 Đặt Lịch Thành Công!
                            </h2>

                            <p className="text-lg text-gray-600 mb-10">
                                Lịch khám của bạn đã được xác nhận. Chúng tôi đã gửi thông tin chi tiết qua email của bạn.
                            </p>

                            {/* Appointment Summary */}
                            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-lg mb-10">
                                <CardContent className="p-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Mã lịch hẹn:</span>
                                            <span className="font-mono font-bold text-lg text-blue-600">APT-{Date.now().toString().slice(-6)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Bác sĩ:</span>
                                            <span className="font-semibold">{selectedDoctor?.user?.fullName}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Ngày giờ:</span>
                                            <span className="font-semibold">{formatDate(selectedDate)} • {selectedSlot?.startTime}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Địa điểm:</span>
                                            <span className="font-semibold">{selectedDoctor?.clinic}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-4">
                                <Button
                                    onClick={() => {
                                        setStep(1);
                                        setSelectedDoctor(null);
                                        setSelectedDate("");
                                        setSelectedSlot(null);
                                        setSymptoms("");
                                        setBookingSuccess(false);
                                    }}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 text-lg"
                                >
                                    <Calendar className="h-5 w-5 mr-2" />
                                    Đặt Lịch Mới
                                </Button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.href = "/bang-dieu-khien/lich-hen"}
                                        className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 h-12"
                                    >
                                        <Clock className="h-5 w-5 mr-2" />
                                        Xem Lịch Hẹn
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.href = "/"}
                                        className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 h-12"
                                    >
                                        <ArrowLeft className="h-5 w-5 mr-2" />
                                        Về Trang Chủ
                                    </Button>
                                </div>
                            </div>

                            {/* Important Notes */}
                            <div className="mt-12 pt-8 border-t">
                                <h4 className="font-semibold text-gray-700 mb-4">📋 Lưu Ý Quan Trọng:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                    <div className="flex items-start">
                                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                            <Clock className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Đến sớm 15 phút</p>
                                            <p className="text-sm text-gray-600">Để hoàn tất thủ tục đăng ký</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                                            <User className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Mang theo CMND/CCCD</p>
                                            <p className="text-sm text-gray-600">Và thẻ BHYT nếu có</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}