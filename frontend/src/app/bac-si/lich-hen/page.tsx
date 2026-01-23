'use client';

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { appointmentService } from "@/services/appointment.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Appointment = {
    id: number;
    appointmentCode: string;
    patientName: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    status: string;
    symptoms?: string;
};

export default function DoctorAppointmentPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const loadAppointments = async () => {
        try {
            const res = await appointmentService.getMyAppointments();
            setAppointments(res.data || []);
        } catch (err) {
            console.error("Load appointments error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAppointments();
    }, []);

    const updateStatus = async (id: number, status: string) => {
        try {
            await appointmentService.updateStatus(id, status);
            loadAppointments(); // reload
        } catch (err) {
            alert("Cập nhật trạng thái thất bại");
        }
    };

    const renderStatus = (status: string) => {
        switch (status) {
            case "Pending":
                return <Badge variant="success">Chờ xác nhận</Badge>;
            case "Confirmed":
                return <Badge className="bg-green-600">Đã xác nhận</Badge>;
            case "Cancelled":
                return <Badge variant="warning">Đã hủy</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <ProtectedRoute allowedRoles={['Doctor']}>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Lịch hẹn của tôi</h1>

                {loading ? (
                    <p>Đang tải lịch hẹn...</p>
                ) : appointments.length === 0 ? (
                    <p>Chưa có lịch hẹn</p>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((a) => (
                            <Card key={a.id}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span>{a.patientName}</span>
                                        {renderStatus(a.status)}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-2">
                                    <p>
                                        📅 {a.appointmentDate} | ⏰ {a.startTime} - {a.endTime}
                                    </p>

                                    {a.symptoms && (
                                        <p className="text-gray-600">
                                            🩺 {a.symptoms}
                                        </p>
                                    )}

                                    {a.status === "Pending" && (
                                        <div className="flex gap-3 mt-3">
                                            <Button
                                                onClick={() => updateStatus(a.id, "Confirmed")}
                                            >
                                                Xác nhận
                                            </Button>

                                            <Button
                                                variant="destructive"
                                                onClick={() => updateStatus(a.id, "Cancelled")}
                                            >
                                                Từ chối
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
