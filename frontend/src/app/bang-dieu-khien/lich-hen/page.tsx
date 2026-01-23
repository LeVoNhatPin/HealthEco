'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { appointmentService } from '@/services/appointment.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const statusMap: Record<string, { label: string; variant: any }> = {
    Pending: { label: 'Chờ xác nhận', variant: 'warning' },
    Approved: { label: 'Đã xác nhận', variant: 'success' },
    Cancelled: { label: 'Đã hủy', variant: 'danger' },
    Completed: { label: 'Hoàn tất', variant: 'info' },
};

export default function MyAppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const res = await appointmentService.getMyAppointments();
            setAppointments(res.data || res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <ProtectedRoute allowedRoles={['Patient']}>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Lịch hẹn của tôi</h1>

                {loading ? (
                    <p>Đang tải...</p>
                ) : appointments.length === 0 ? (
                    <p className="text-gray-500">Bạn chưa có lịch hẹn nào.</p>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((a) => {
                            const status = statusMap[a.status] || statusMap.Pending;

                            return (
                                <Card key={a.id}>
                                    <CardHeader className="flex flex-row justify-between items-center">
                                        <CardTitle>{a.doctorName}</CardTitle>
                                        <Badge variant={status.variant}>
                                            {status.label}
                                        </Badge>
                                    </CardHeader>

                                    <CardContent className="space-y-2">
                                        <p>
                                            <strong>Ngày:</strong> {a.appointmentDate}
                                        </p>
                                        <p>
                                            <strong>Giờ:</strong> {a.startTime} – {a.endTime}
                                        </p>
                                        {a.symptoms && (
                                            <p>
                                                <strong>Triệu chứng:</strong> {a.symptoms}
                                            </p>
                                        )}

                                        {a.status === 'Pending' && (
                                            <Button
                                                variant="outline"
                                                onClick={() => appointmentService.cancelAppointment(a.id).then(loadData)}
                                            >
                                                Hủy lịch
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
