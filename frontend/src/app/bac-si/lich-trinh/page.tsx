"use client";

import { useEffect, useState } from "react";
import { scheduleService } from "@/services/schedule.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Trash2, 
  PlusCircle, 
  CalendarDays, 
  Users, 
  Clock4,
  RotateCw,
  CalendarRange,
  CheckCircle,
  AlertCircle
} from "lucide-react";

type Schedule = {
    id: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDuration: number;
    maxPatientsPerSlot: number;
    validFrom: string;
    validTo: string | null;
    facilityName?: string;
};

export default function DoctorSchedulePage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        dayOfWeek: "1",
        startTime: "08:00",
        endTime: "17:00",
        slotDuration: "30",
        maxPatientsPerSlot: "1",
        validFrom: new Date().toISOString().split("T")[0],
        validTo: "",
    });

    const daysOfWeek = [
        { value: "1", label: "Thứ Hai", shortLabel: "T2" },
        { value: "2", label: "Thứ Ba", shortLabel: "T3" },
        { value: "3", label: "Thứ Tư", shortLabel: "T4" },
        { value: "4", label: "Thứ Năm", shortLabel: "T5" },
        { value: "5", label: "Thứ Sáu", shortLabel: "T6" },
        { value: "6", label: "Thứ Bảy", shortLabel: "T7" },
        { value: "0", label: "Chủ Nhật", shortLabel: "CN" },
    ];

    useEffect(() => {
        loadSchedules();
    }, []);

    const loadSchedules = async () => {
        try {
            setLoading(true);
            const data = await scheduleService.getMySchedules();
            setSchedules(data || []);
        } catch (err) {
            console.error("LOAD SCHEDULE ERROR:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            dayOfWeek: Number(formData.dayOfWeek),
            startTime: formData.startTime,
            endTime: formData.endTime,
            slotDuration: Number(formData.slotDuration),
            maxPatientsPerSlot: Number(formData.maxPatientsPerSlot),
            validFrom: formData.validFrom,
            validTo: formData.validTo || null,
        };

        try {
            await scheduleService.createSchedule(payload);
            resetForm();
            loadSchedules();
        } catch (err) {
            console.error("CREATE ERROR:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            dayOfWeek: "1",
            startTime: "08:00",
            endTime: "17:00",
            slotDuration: "30",
            maxPatientsPerSlot: "1",
            validFrom: new Date().toISOString().split("T")[0],
            validTo: "",
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa lịch trực này?")) return;

        try {
            await scheduleService.deleteSchedule(id);
            loadSchedules();
        } catch (err) {
            console.error("DELETE ERROR:", err);
        }
    };

    const getDayLabel = (day: number) => {
        const map: Record<number, string> = {
            0: "Chủ Nhật",
            1: "Thứ Hai",
            2: "Thứ Ba",
            3: "Thứ Tư",
            4: "Thứ Năm",
            5: "Thứ Sáu",
            6: "Thứ Bảy",
        };
        return map[day] || `Ngày ${day}`;
    };

    const getDayShortLabel = (day: number) => {
        const map: Record<number, string> = {
            0: "CN",
            1: "T2",
            2: "T3",
            3: "T4",
            4: "T5",
            5: "T6",
            6: "T7",
        };
        return map[day] || `D${day}`;
    };

    const getDayColor = (day: number) => {
        const colors = [
            "bg-red-100 text-red-800 border-red-200", // CN
            "bg-blue-100 text-blue-800 border-blue-200", // T2
            "bg-green-100 text-green-800 border-green-200", // T3
            "bg-yellow-100 text-yellow-800 border-yellow-200", // T4
            "bg-purple-100 text-purple-800 border-purple-200", // T5
            "bg-pink-100 text-pink-800 border-pink-200", // T6
            "bg-indigo-100 text-indigo-800 border-indigo-200", // T7
        ];
        return colors[day] || "bg-gray-100 text-gray-800 border-gray-200";
    };

    const calculateSlots = (start: string, end: string, duration: number) => {
        const [startHour, startMinute] = start.split(":").map(Number);
        const [endHour, endMinute] = end.split(":").map(Number);
        
        const startTotal = startHour * 60 + startMinute;
        const endTotal = endHour * 60 + endMinute;
        
        return Math.floor((endTotal - startTotal) / duration);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản Lý Lịch Trực</h1>
                            <p className="text-gray-600">Thiết lập và quản lý lịch làm việc của bạn</p>
                        </div>
                        <div className="flex items-center space-x-3 mt-4 md:mt-0">
                            <Button 
                                variant="outline" 
                                onClick={loadSchedules}
                                className="border-gray-300"
                            >
                                <RotateCw className="h-4 w-4 mr-2" />
                                Làm mới
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Create Schedule Form */}
                    <div className="lg:col-span-1">
                        <Card className="bg-white border-none shadow-xl sticky top-6">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                <CardTitle className="flex items-center">
                                    <PlusCircle className="h-5 w-5 mr-2 text-blue-600" />
                                    Tạo Lịch Trực Mới
                                </CardTitle>
                                <CardDescription>
                                    Thiết lập lịch làm việc của bạn
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Day of Week */}
                                    <div className="space-y-2">
                                        <Label htmlFor="dayOfWeek" className="flex items-center">
                                            <CalendarDays className="h-4 w-4 mr-2 text-blue-500" />
                                            Ngày trong tuần
                                        </Label>
                                        <Select
                                            value={formData.dayOfWeek}
                                            onValueChange={(value) => setFormData({...formData, dayOfWeek: value})}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn ngày" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {daysOfWeek.map((day) => (
                                                    <SelectItem key={day.value} value={day.value}>
                                                        {day.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Time Range */}
                                    <div className="space-y-2">
                                        <Label className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-blue-500" />
                                            Thời gian làm việc
                                        </Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label htmlFor="startTime" className="text-sm text-gray-600">Bắt đầu</Label>
                                                <Input
                                                    id="startTime"
                                                    type="time"
                                                    value={formData.startTime}
                                                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="endTime" className="text-sm text-gray-600">Kết thúc</Label>
                                                <Input
                                                    id="endTime"
                                                    type="time"
                                                    value={formData.endTime}
                                                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Slot Duration */}
                                    <div className="space-y-2">
                                        <Label htmlFor="slotDuration" className="flex items-center">
                                            <Clock4 className="h-4 w-4 mr-2 text-blue-500" />
                                            Thời gian mỗi slot
                                        </Label>
                                        <Select
                                            value={formData.slotDuration}
                                            onValueChange={(value) => setFormData({...formData, slotDuration: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn thời gian" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="15">15 phút</SelectItem>
                                                <SelectItem value="20">20 phút</SelectItem>
                                                <SelectItem value="30">30 phút</SelectItem>
                                                <SelectItem value="45">45 phút</SelectItem>
                                                <SelectItem value="60">60 phút</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Max Patients */}
                                    <div className="space-y-2">
                                        <Label htmlFor="maxPatientsPerSlot" className="flex items-center">
                                            <Users className="h-4 w-4 mr-2 text-blue-500" />
                                            Số bệnh nhân/slot
                                        </Label>
                                        <Input
                                            id="maxPatientsPerSlot"
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={formData.maxPatientsPerSlot}
                                            onChange={(e) => setFormData({...formData, maxPatientsPerSlot: e.target.value})}
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Date Range */}
                                    <div className="space-y-2">
                                        <Label className="flex items-center">
                                            <CalendarRange className="h-4 w-4 mr-2 text-blue-500" />
                                            Thời hạn lịch
                                        </Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label htmlFor="validFrom" className="text-sm text-gray-600">Từ ngày</Label>
                                                <Input
                                                    id="validFrom"
                                                    type="date"
                                                    value={formData.validFrom}
                                                    onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="validTo" className="text-sm text-gray-600">Đến ngày</Label>
                                                <Input
                                                    id="validTo"
                                                    type="date"
                                                    value={formData.validTo}
                                                    onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                                                    placeholder="Không giới hạn"
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-dashed">
                                        <CardContent className="p-4">
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Thời gian:</span>
                                                    <span className="font-semibold">
                                                        {formData.startTime} - {formData.endTime}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Tổng slot:</span>
                                                    <span className="font-semibold">
                                                        {calculateSlots(formData.startTime, formData.endTime, parseInt(formData.slotDuration))} slot
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Tổng bệnh nhân/ngày:</span>
                                                    <span className="font-semibold">
                                                        {calculateSlots(formData.startTime, formData.endTime, parseInt(formData.slotDuration)) * parseInt(formData.maxPatientsPerSlot)} người
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Form Actions */}
                                    <div className="flex space-x-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={resetForm}
                                            className="flex-1 border-gray-300"
                                        >
                                            Đặt lại
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                        >
                                            {submitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Tạo Lịch
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Schedules List */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white border-none shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                <CardTitle className="flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                                    Lịch Trực Hiện Tại
                                </CardTitle>
                                <CardDescription>
                                    {schedules.length} lịch trực đang hoạt động
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                {loading ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                            <p className="mt-4 text-gray-600">Đang tải lịch trực...</p>
                                        </div>
                                    </div>
                                ) : schedules.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 text-6xl mb-4">📅</div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có lịch trực nào</h3>
                                        <p className="text-gray-500 mb-6">Hãy tạo lịch trực mới để bắt đầu</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {schedules.map((schedule) => {
                                            const totalSlots = calculateSlots(
                                                schedule.startTime, 
                                                schedule.endTime, 
                                                schedule.slotDuration
                                            );
                                            const totalPatients = totalSlots * schedule.maxPatientsPerSlot;

                                            return (
                                                <Card key={schedule.id} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                                                    <CardContent className="p-6">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center mb-4">
                                                                    <Badge className={`px-3 py-1.5 text-sm ${getDayColor(schedule.dayOfWeek)}`}>
                                                                        {getDayShortLabel(schedule.dayOfWeek)} - {getDayLabel(schedule.dayOfWeek)}
                                                                    </Badge>
                                                                    {schedule.facilityName && (
                                                                        <Badge variant="success" className="ml-2 border-blue-200 text-blue-700">
                                                                            {schedule.facilityName}
                                                                        </Badge>
                                                                    )}
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                                    <div className="flex items-center">
                                                                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                                                            <Clock className="h-5 w-5 text-blue-600" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm text-gray-600">Giờ làm việc</p>
                                                                            <p className="font-semibold text-gray-900">
                                                                                {schedule.startTime} - {schedule.endTime}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center">
                                                                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                                                                            <Clock4 className="h-5 w-5 text-green-600" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm text-gray-600">Thời gian/slot</p>
                                                                            <p className="font-semibold text-gray-900">
                                                                                {schedule.slotDuration} phút
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center">
                                                                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                                                                            <Users className="h-5 w-5 text-purple-600" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm text-gray-600">Bệnh nhân/slot</p>
                                                                            <p className="font-semibold text-gray-900">
                                                                                {schedule.maxPatientsPerSlot} người
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg">
                                                                        <p className="text-sm text-blue-600">Tổng slot</p>
                                                                        <p className="text-xl font-bold text-blue-700">{totalSlots}</p>
                                                                    </div>
                                                                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg">
                                                                        <p className="text-sm text-green-600">Tổng bệnh nhân</p>
                                                                        <p className="text-xl font-bold text-green-700">{totalPatients}</p>
                                                                    </div>
                                                                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 rounded-lg">
                                                                        <p className="text-sm text-amber-600">Hiệu lực</p>
                                                                        <p className="text-sm font-semibold text-amber-700">
                                                                            {new Date(schedule.validFrom).toLocaleDateString('vi-VN')}
                                                                            {schedule.validTo && ` - ${new Date(schedule.validTo).toLocaleDateString('vi-VN')}`}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="mt-4 md:mt-0 md:ml-4">
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => handleDelete(schedule.id)}
                                                                    className="w-full md:w-auto"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Xóa
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Stats Summary */}
                                {schedules.length > 0 && (
                                    <div className="mt-8 pt-8 border-t">
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                                <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                                                Thống Kê Tổng Quan
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-blue-600">{schedules.length}</div>
                                                    <div className="text-sm text-gray-600">Tổng lịch</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {schedules.reduce((acc, sched) => {
                                                            const slots = calculateSlots(sched.startTime, sched.endTime, sched.slotDuration);
                                                            return acc + (slots * sched.maxPatientsPerSlot);
                                                        }, 0)}
                                                    </div>
                                                    <div className="text-sm text-gray-600">Tổng slot/tuần</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-purple-600">
                                                        {new Set(schedules.map(s => s.dayOfWeek)).size}
                                                    </div>
                                                    <div className="text-sm text-gray-600">Ngày làm việc</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-amber-600">
                                                        {schedules.filter(s => !s.validTo || new Date(s.validTo) > new Date()).length}
                                                    </div>
                                                    <div className="text-sm text-gray-600">Đang hoạt động</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}