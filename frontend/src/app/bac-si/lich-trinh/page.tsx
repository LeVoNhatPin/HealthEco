"use client";

import { useEffect, useState } from "react";
import { scheduleService } from "@/services/schedule.service";

type Schedule = {
    id: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDuration: number;
    maxPatientsPerSlot: number;
};

export default function DoctorSchedulePage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);

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

    /* ================= LOAD ================= */
    const loadSchedules = async () => {
        try {
            const data = await scheduleService.getMySchedules();
            setSchedules(data || []);
        } catch (err) {
            console.error("LOAD SCHEDULE ERROR:", err);
        } finally {
            setLoading(false);
        }
    };

    /* ================= CREATE ================= */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            dayOfWeek: Number(formData.dayOfWeek),
            startTime: formData.startTime,
            endTime: formData.endTime,
            slotDuration: Number(formData.slotDuration),
            maxPatientsPerSlot: Number(formData.maxPatientsPerSlot),
            validFrom: formData.validFrom,
            validTo: formData.validTo || null,
        };

        console.log("CREATE PAYLOAD:", payload);

        try {
            await scheduleService.createSchedule(payload);
            alert("✅ Tạo lịch trực thành công");
            resetForm();
            loadSchedules();
        } catch (err) {
            console.error("CREATE ERROR:", err);
            alert("❌ Tạo lịch thất bại");
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

    /* ================= DELETE ================= */
    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa lịch này?")) return;

        try {
            await scheduleService.deleteSchedule(id);
            loadSchedules();
        } catch (err) {
            console.error("DELETE ERROR:", err);
            alert("❌ Xóa thất bại");
        }
    };

    const dayLabel = (day: number) => {
        const map: any = {
            0: "Chủ nhật",
            1: "Thứ 2",
            2: "Thứ 3",
            3: "Thứ 4",
            4: "Thứ 5",
            5: "Thứ 6",
            6: "Thứ 7",
        };
        return map[day] ?? day;
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
                {/* FORM */}
                <div className="bg-white rounded shadow p-6">
                    <h2 className="font-semibold mb-4">Tạo lịch trực</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <select
                            className="w-full border px-3 py-2 rounded"
                            value={formData.dayOfWeek}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    dayOfWeek: e.target.value,
                                })
                            }
                        >
                            {daysOfWeek.map((d) => (
                                <option key={d.value} value={d.value}>
                                    {d.label}
                                </option>
                            ))}
                        </select>

                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        startTime: e.target.value,
                                    })
                                }
                                className="border px-3 py-2 rounded"
                            />
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        endTime: e.target.value,
                                    })
                                }
                                className="border px-3 py-2 rounded"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                min={15}
                                step={15}
                                value={formData.slotDuration}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        slotDuration: e.target.value,
                                    })
                                }
                                className="border px-3 py-2 rounded"
                            />
                            <input
                                type="number"
                                min={1}
                                value={formData.maxPatientsPerSlot}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        maxPatientsPerSlot: e.target.value,
                                    })
                                }
                                className="border px-3 py-2 rounded"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="date"
                                value={formData.validFrom}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        validFrom: e.target.value,
                                    })
                                }
                                className="border px-3 py-2 rounded"
                            />
                            <input
                                type="date"
                                value={formData.validTo}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        validTo: e.target.value,
                                    })
                                }
                                className="border px-3 py-2 rounded"
                            />
                        </div>

                        <button className="w-full bg-primary text-white py-2 rounded">
                            Tạo lịch
                        </button>
                    </form>
                </div>

                {/* TABLE */}
                <div className="lg:col-span-2 bg-white rounded shadow p-6">
                    <h2 className="font-semibold mb-4">Lịch trực hiện tại</h2>

                    {schedules.length === 0 ? (
                        <p className="text-gray-500">Chưa có lịch</p>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2">Cơ sở</th>
                                    <th className="p-2">Ngày</th>
                                    <th className="p-2">Giờ</th>
                                    <th className="p-2">Slot</th>
                                    <th className="p-2">BN/slot</th>
                                    <th className="p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map((s) => (
                                    <tr key={s.id} className="border-t">
                                        <td className="p-2">
                                            {dayLabel(s.dayOfWeek)}
                                        </td>
                                        <td className="p-2">
                                            {s.startTime} – {s.endTime}
                                        </td>
                                        <td className="p-2">
                                            {s.slotDuration}p
                                        </td>
                                        <td className="p-2">
                                            {s.maxPatientsPerSlot}
                                        </td>
                                        <td className="p-2">
                                            <button
                                                onClick={() =>
                                                    handleDelete(s.id)
                                                }
                                                className="text-red-600 hover:underline"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
