'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { appointmentService } from '@/services/appointment.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Calendar, 
    Clock, 
    User, 
    Stethoscope, 
    MapPin, 
    FileText, 
    AlertCircle,
    CheckCircle,
    XCircle,
    ChevronRight,
    Filter,
    RefreshCw
} from 'lucide-react';

const statusMap: Record<string, { label: string; variant: any; color: string; icon: any }> = {
    Pending: { 
        label: 'Chờ xác nhận', 
        variant: 'outline',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Clock
    },
    Approved: { 
        label: 'Đã xác nhận', 
        variant: 'default',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle
    },
    Confirmed: { 
        label: 'Đã xác nhận', 
        variant: 'default',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle
    },
    Cancelled: { 
        label: 'Đã hủy', 
        variant: 'destructive',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle
    },
    Completed: { 
        label: 'Hoàn tất', 
        variant: 'secondary',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle
    },
};

export default function MyAppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await appointmentService.getMyAppointments();
            const data = res.data || res || [];
            setAppointments(data);
            filterAppointments(data, activeTab);
        } catch (err) {
            console.error('Lỗi khi tải lịch hẹn:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterAppointments = (data: any[], status: string) => {
        if (status === 'all') {
            setFilteredAppointments(data);
        } else {
            setFilteredAppointments(data.filter(appointment => 
                appointment.status.toLowerCase() === status.toLowerCase()
            ));
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterAppointments(appointments, activeTab);
    }, [activeTab, appointments]);

    const handleCancelAppointment = async (id: number) => {
        if (confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
            try {
                await appointmentService.cancelAppointment(id);
                loadData();
            } catch (err) {
                console.error('Lỗi khi hủy lịch hẹn:', err);
                alert('Không thể hủy lịch hẹn. Vui lòng thử lại!');
            }
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusConfig = (status: string) => {
        return statusMap[status] || statusMap.Pending;
    };

    const appointmentStats = {
        total: appointments.length,
        pending: appointments.filter(a => a.status === 'Pending').length,
        confirmed: appointments.filter(a => a.status === 'Confirmed' || a.status === 'Approved').length,
        completed: appointments.filter(a => a.status === 'Completed').length,
        cancelled: appointments.filter(a => a.status === 'Cancelled').length
    };

    return (
        <ProtectedRoute allowedRoles={['Patient']}>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch Hẹn Của Tôi</h1>
                                <p className="text-gray-600">Quản lý và theo dõi các lịch hẹn khám của bạn</p>
                            </div>
                            <div className="flex space-x-3 mt-4 md:mt-0">
                                <Button variant="outline" onClick={loadData} disabled={loading}>
                                    <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                    {loading ? 'Đang tải...' : 'Làm mới'}
                                </Button>
                                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600" asChild>
                                    <a href="/dat-lich">
                                        <Calendar className="h-5 w-5 mr-2" />
                                        Đặt lịch mới
                                    </a>
                                </Button>
                            </div>
                        </div>

                        {/* Stats Overview */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none shadow-lg">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm opacity-90">Tổng số lịch hẹn</p>
                                            <p className="text-2xl font-bold">{appointmentStats.total}</p>
                                        </div>
                                        <div className="p-3 bg-white/20 rounded-xl">
                                            <Calendar className="h-6 w-6" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-none shadow-lg">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm opacity-90">Chờ xác nhận</p>
                                            <p className="text-2xl font-bold">{appointmentStats.pending}</p>
                                        </div>
                                        <div className="p-3 bg-white/20 rounded-xl">
                                            <Clock className="h-6 w-6" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none shadow-lg">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm opacity-90">Đã xác nhận</p>
                                            <p className="text-2xl font-bold">{appointmentStats.confirmed}</p>
                                        </div>
                                        <div className="p-3 bg-white/20 rounded-xl">
                                            <CheckCircle className="h-6 w-6" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-none shadow-lg">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm opacity-90">Hoàn thành</p>
                                            <p className="text-2xl font-bold">{appointmentStats.completed}</p>
                                        </div>
                                        <div className="p-3 bg-white/20 rounded-xl">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                            <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-auto bg-white/80 backdrop-blur-sm">
                                <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                                    Tất cả ({appointmentStats.total})
                                </TabsTrigger>
                                <TabsTrigger value="pending" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white">
                                    Chờ xác nhận ({appointmentStats.pending})
                                </TabsTrigger>
                                <TabsTrigger value="confirmed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                                    Đã xác nhận ({appointmentStats.confirmed})
                                </TabsTrigger>
                                <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white">
                                    Hoàn thành ({appointmentStats.completed})
                                </TabsTrigger>
                                <TabsTrigger value="cancelled" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white">
                                    Đã hủy ({appointmentStats.cancelled})
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Appointments List */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Đang tải lịch hẹn...</p>
                            </div>
                        </div>
                    ) : filteredAppointments.length === 0 ? (
                        <Card className="bg-white/80 backdrop-blur-sm border-none shadow-xl">
                            <CardContent className="py-16 text-center">
                                <div className="text-gray-400 text-6xl mb-4">📅</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    {activeTab === 'all' ? 'Chưa có lịch hẹn nào' : `Không có lịch hẹn ${getStatusConfig(activeTab.charAt(0).toUpperCase() + activeTab.slice(1)).label.toLowerCase()}`}
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {activeTab === 'all' 
                                        ? 'Hãy đặt lịch hẹn với bác sĩ để bắt đầu trải nghiệm dịch vụ của chúng tôi' 
                                        : 'Không tìm thấy lịch hẹn nào với trạng thái này'}
                                </p>
                                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600">
                                    <a href="/dat-lich">
                                        <Calendar className="h-5 w-5 mr-2" />
                                        Đặt lịch ngay
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {filteredAppointments.map((appointment) => {
                                const statusConfig = getStatusConfig(appointment.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <Card key={appointment.id} className="bg-white/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                                {/* Left Column - Date & Time */}
                                                <div className="lg:w-1/4">
                                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 text-center">
                                                        <div className="text-2xl font-bold mb-1">
                                                            {new Date(appointment.appointmentDate).getDate()}
                                                        </div>
                                                        <div className="text-sm opacity-90">
                                                            Tháng {new Date(appointment.appointmentDate).getMonth() + 1}
                                                        </div>
                                                        <div className="text-xs opacity-75 mt-2">
                                                            {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN', { weekday: 'long' })}
                                                        </div>
                                                        <div className="flex items-center justify-center mt-3 text-sm">
                                                            <Clock className="h-4 w-4 mr-1" />
                                                            {appointment.startTime} - {appointment.endTime}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Middle Column - Appointment Details */}
                                                <div className="lg:w-1/2">
                                                    <div className="flex items-start mb-4">
                                                        <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                                            <Stethoscope className="h-6 w-6 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h3 className="text-xl font-bold text-gray-900">
                                                                    {appointment.doctorName || 'Bác sĩ'}
                                                                </h3>
                                                                <Badge className={`px-3 py-1 ${statusConfig.color}`}>
                                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                                    {statusConfig.label}
                                                                </Badge>
                                                            </div>
                                                            
                                                            <div className="space-y-2 text-gray-600">
                                                                <div className="flex items-center">
                                                                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                                                    <span>{formatDate(appointment.appointmentDate)}</span>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <Clock className="h-4 w-4 mr-2 text-green-500" />
                                                                    <span>{appointment.startTime} - {appointment.endTime}</span>
                                                                </div>
                                                                {appointment.facilityName && (
                                                                    <div className="flex items-center">
                                                                        <MapPin className="h-4 w-4 mr-2 text-red-500" />
                                                                        <span>{appointment.facilityName}</span>
                                                                    </div>
                                                                )}
                                                                {appointment.symptoms && (
                                                                    <div className="flex items-start mt-3">
                                                                        <AlertCircle className="h-4 w-4 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                                                                        <div className="bg-amber-50 p-3 rounded-lg flex-1">
                                                                            <p className="text-sm font-medium text-amber-800 mb-1">Triệu chứng:</p>
                                                                            <p className="text-amber-700">{appointment.symptoms}</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Column - Actions */}
                                                <div className="lg:w-1/4">
                                                    <div className="flex flex-col space-y-3">
                                                        {appointment.status === 'Pending' && (
                                                            <Button 
                                                                variant="destructive" 
                                                                className="w-full"
                                                                onClick={() => handleCancelAppointment(appointment.id)}
                                                            >
                                                                <XCircle className="h-5 w-5 mr-2" />
                                                                Hủy lịch hẹn
                                                            </Button>
                                                        )}
                                                        
                                                        <Button variant="outline" className="w-full" asChild>
                                                            <a href={`/lich-hen/${appointment.id}`}>
                                                                <FileText className="h-5 w-5 mr-2" />
                                                                Xem chi tiết
                                                            </a>
                                                        </Button>
                                                        
                                                        <Button variant="ghost" className="w-full" asChild>
                                                            <a href={`/bac-si/${appointment.doctorId || ''}`}>
                                                                <User className="h-5 w-5 mr-2" />
                                                                Xem thông tin bác sĩ
                                                                <ChevronRight className="h-4 w-4 ml-2" />
                                                            </a>
                                                        </Button>
                                                    </div>
                                                    
                                                    {appointment.consultationFee && (
                                                        <div className="mt-4 pt-4 border-t">
                                                            <div className="text-sm text-gray-500">Chi phí tư vấn</div>
                                                            <div className="text-xl font-bold text-gray-900">
                                                                {appointment.consultationFee.toLocaleString('vi-VN')} VNĐ
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}

                    {/* Quick Tips */}
                    {!loading && filteredAppointments.length > 0 && (
                        <Card className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-none shadow-xl">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <AlertCircle className="h-6 w-6 mr-3 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Lưu ý quan trọng</h4>
                                        <p className="text-sm opacity-90">
                                            Vui lòng có mặt tại phòng khám trước 15 phút. Mang theo giấy tờ tùy thân và thẻ bảo hiểm y tế (nếu có).
                                            Liên hệ hotline 1900-xxxx nếu có thay đổi về lịch hẹn.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}