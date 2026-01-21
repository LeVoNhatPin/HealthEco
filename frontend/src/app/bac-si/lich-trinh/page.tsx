"use client";

import { useState, useEffect } from "react";
import { scheduleService } from "@/services/schedule.service";
import { authService } from "@/services/auth.service";

export default function DoctorSchedulePage() {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        facilityId: "",
        dayOfWeek: "1",
        startTime: "08:00",
        endTime: "17:00",
        slotDuration: "30",
        maxPatientsPerSlot: "1",
        validFrom: new Date().toISOString().split("T")[0],
        validTo: "",
    });

    const daysOfWeek = [
        { value: "1", label: "Thứ 2" },
        { value: "2", label: "Thứ 3" },
        { value: "3", label: "Thứ 4" },
        { value: "4", label: "Thứ 5" },
        { value: "5", label: "Thứ 6" },
        { value: "6", label: "Thứ 7" },
        { value: "0", label: "Chủ nhật" },
    ];

    useEffect(() => {
        loadSchedules();
    }, []);

    const loadSchedules = async () => {
        try {
            const response = await scheduleService.getMySchedules();
            setSchedules(response.data || []);
        } catch (error) {
            console.error("Error loading schedules:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await scheduleService.createSchedule(formData);
            alert("Tạo lịch trực thành công!");
            loadSchedules();
            resetForm();
        } catch (error: any) {
            alert(error.message || "Có lỗi xảy ra khi tạo lịch");
        }
    };

    const resetForm = () => {
        setFormData({
            facilityId: "",
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
        if (confirm("Bạn có chắc muốn xóa lịch trực này?")) {
            try {
                await scheduleService.deleteSchedule(id);
                alert("Xóa lịch trực thành công!");
                loadSchedules();
            } catch (error: any) {
                alert(error.message || "Có lỗi xảy ra");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Quản lý lịch trực</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form tạo lịch */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Tạo lịch trực mới</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Cơ sở y tế
                                    </label>
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={formData.facilityId}
                                        onChange={(e) =>
                                            setFormData({ ...formData, facilityId: e.target.value })
                                        }
                                        required
                                    >
                                        <option value="">Chọn cơ sở</option>
                                        {/* TODO: Load facilities from API */}
                                        <option value="1">Phòng khám số 1</option>
                                        <option value="2">Phòng khám số 2</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Ngày trong tuần
                                    </label>
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={formData.dayOfWeek}
                                        onChange={(e) =>
                                            setFormData({ ...formData, dayOfWeek: e.target.value })
                                        }
                                        required
                                    >
                                        {daysOfWeek.map((day) => (
                                            <option key={day.value} value={day.value}>
                                                {day.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Giờ bắt đầu
                                        </label>
                                        <input
                                            type="time"
                                            className="w-full border rounded px-3 py-2"
                                            value={formData.startTime}
                                            onChange={(e) =>
                                                setFormData({ ...formData, startTime: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Giờ kết thúc
                                        </label>
                                        <input
                                            type="time"
                                            className="w-full border rounded px-3 py-2"
                                            value={formData.endTime}
                                            onChange={(e) =>
                                                setFormData({ ...formData, endTime: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Thời gian slot (phút)
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full border rounded px-3 py-2"
                                            value={formData.slotDuration}
                                            onChange={(e) =>
                                                setFormData({ ...formData, slotDuration: e.target.value })
                                            }
                                            min="15"
                                            step="15"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Số bệnh nhân/slot
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full border rounded px-3 py-2"
                                            value={formData.maxPatientsPerSlot}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    maxPatientsPerSlot: e.target.value,
                                                })
                                            }
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Có hiệu lực từ
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border rounded px-3 py-2"
                                            value={formData.validFrom}
                                            onChange={(e) =>
                                                setFormData({ ...formData, validFrom: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Đến ngày (nếu có)
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border rounded px-3 py-2"
                                            value={formData.validTo}
                                            onChange={(e) =>
                                                setFormData({ ...formData, validTo: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition"
                                >
                                    Tạo lịch trực
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Danh sách lịch trực */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Lịch trực hiện tại</h2>
                        {schedules.length === 0 ? (
                            <p className="text-gray-500">Chưa có lịch trực nào</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-3 text-left">Cơ sở</th>
                                            <th className="px-4 py-3 text-left">Ngày</th>
                                            <th className="px-4 py-3 text-left">Giờ làm việc</th>
                                            <th className="px-4 py-3 text-left">Thời gian slot</th>
                                            <th className="px-4 py-3 text-left">Số BN/slot</th>
                                            <th className="px-4 py-3 text-left">Trạng thái</th>
                                            <th className="px-4 py-3 text-left">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedules.map((schedule) => (
                                            <tr key={schedule.id} className="border-t hover:bg-gray-50">
                                                <td className="px-4 py-3">Cơ sở {schedule.facilityId}</td>
                                                <td className="px-4 py-3">{schedule.dayOfWeek}</td>
                                                <td className="px-4 py-3">
                                                    {schedule.startTime} - {schedule.endTime}
                                                </td>
                                                <td className="px-4 py-3">{schedule.slotDuration} phút</td>
                                                <td className="px-4 py-3">{schedule.maxPatientsPerSlot}</td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs ${schedule.isActive
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        {schedule.isActive ? "Đang hoạt động" : "Đã hủy"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => handleDelete(schedule.id)}
                                                        className="text-red-600 hover:text-red-800 hover:underline"
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}