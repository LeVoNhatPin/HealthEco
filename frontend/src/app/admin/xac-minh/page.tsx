"use client";

import { useEffect, useState } from "react";
import adminApi from "@/lib/admin";

interface Doctor {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    specialty: string;
    licenseNumber: string;
    consultationFee: number;
}

export default function XacMinhBacSiPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPendingDoctors();
    }, []);

    const fetchPendingDoctors = async () => {
        try {
            setLoading(true);
            const res = await adminApi.getPendingDoctors();
            setDoctors(res.data);
        } catch (error) {
            console.error("Lỗi lấy danh sách bác sĩ chờ xác minh", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (doctorId: number) => {
        if (!confirm("Xác nhận duyệt bác sĩ này?")) return;

        try {
            await adminApi.approveDoctor(doctorId);
            alert("Đã duyệt bác sĩ");
            fetchPendingDoctors();
        } catch (error) {
            alert("Duyệt thất bại");
        }
    };

    const handleReject = async (doctorId: number) => {
        const reason = prompt("Nhập lý do từ chối:");
        if (!reason) return;

        try {
            await adminApi.rejectDoctor(doctorId, reason);
            alert("Đã từ chối bác sĩ");
            fetchPendingDoctors();
        } catch (error) {
            alert("Từ chối thất bại");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Xác minh thông tin bác sĩ
            </h1>

            {loading && <p>Đang tải...</p>}

            {!loading && doctors.length === 0 && (
                <p>Không có bác sĩ chờ xác minh</p>
            )}

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Họ tên</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Chuyên khoa</th>
                        <th className="border p-2">Số giấy phép</th>
                        <th className="border p-2">Phí khám (VNĐ)</th>
                        <th className="border p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map((doctor) => (
                        <tr key={doctor.id}>
                            <td className="border p-2">{doctor.fullName}</td>
                            <td className="border p-2">{doctor.email}</td>
                            <td className="border p-2">{doctor.specialty}</td>
                            <td className="border p-2">{doctor.licenseNumber}</td>
                            <td className="border p-2 text-right">
                                {doctor.consultationFee.toLocaleString()}
                            </td>
                            <td className="border p-2 space-x-2">
                                <button
                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                    onClick={() => handleApprove(doctor.id)}
                                >
                                    Duyệt
                                </button>
                                <button
                                    className="bg-red-600 text-white px-3 py-1 rounded"
                                    onClick={() => handleReject(doctor.id)}
                                >
                                    Từ chối
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
