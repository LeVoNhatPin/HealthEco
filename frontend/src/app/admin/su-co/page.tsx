// frontend/src/app/admin/su-co/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/admin.service';
import {
    Search,
    Filter,
    AlertTriangle,
    CheckCircle,
    Clock,
    XCircle,
    Eye,
    MessageSquare
} from 'lucide-react';

interface Issue {
    id: number;
    title: string;
    description: string;
    type: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'in_progress' | 'resolved' | 'closed';
    reportedBy: string;
    createdAt: string;
    updatedAt: string;
}

export default function IssuesPage() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadIssues();
    }, []);

    const loadIssues = async () => {
        try {
            setLoading(true);
            const response = await adminService.getIssues();

            if (response.success) {
                setIssues(response.data || []);
            } else {
                // Mock data cho demo
                setIssues([
                    {
                        id: 1,
                        title: 'Lỗi thanh toán VNPay',
                        description: 'Thanh toán qua VNPay thất bại với lỗi timeout',
                        type: 'payment',
                        priority: 'high',
                        status: 'pending',
                        reportedBy: 'Nguyễn Văn A',
                        createdAt: '2024-01-15T10:30:00',
                        updatedAt: '2024-01-15T10:30:00'
                    },
                    {
                        id: 2,
                        title: 'Không thể đặt lịch với bác sĩ',
                        description: 'Hệ thống báo lỗi khi đặt lịch với bác sĩ có ID 123',
                        type: 'booking',
                        priority: 'critical',
                        status: 'in_progress',
                        reportedBy: 'Trần Thị B',
                        createdAt: '2024-01-14T14:20:00',
                        updatedAt: '2024-01-15T09:15:00'
                    },
                    {
                        id: 3,
                        title: 'Hiển thị sai giờ cuộc hẹn',
                        description: 'Thời gian cuộc hẹn hiển thị sai múi giờ',
                        type: 'display',
                        priority: 'medium',
                        status: 'resolved',
                        reportedBy: 'Lê Văn C',
                        createdAt: '2024-01-13T08:45:00',
                        updatedAt: '2024-01-14T16:30:00'
                    }
                ]);
            }
        } catch (error) {
            console.error('Error loading issues:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-100 text-red-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'in_progress': return <AlertTriangle className="h-4 w-4 text-blue-500" />;
            case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'closed': return <XCircle className="h-4 w-4 text-gray-500" />;
            default: return null;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const filteredIssues = issues.filter(issue => {
        const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Sự cố</h1>
                <p className="text-gray-600">Theo dõi và xử lý các sự cố hệ thống</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sự cố..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-48">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="pending">Chờ xử lý</option>
                            <option value="in_progress">Đang xử lý</option>
                            <option value="resolved">Đã giải quyết</option>
                            <option value="closed">Đã đóng</option>
                        </select>
                    </div>
                    <button
                        onClick={loadIssues}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Tìm kiếm
                    </button>
                </div>
            </div>

            {/* Issues list */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Đang tải danh sách sự cố...</p>
                    </div>
                ) : filteredIssues.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="inline-block p-4 bg-green-50 rounded-full">
                            <CheckCircle className="h-12 w-12 text-green-500" />
                        </div>
                        <p className="mt-4 text-gray-600">Không có sự cố nào</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredIssues.map((issue) => (
                            <div key={issue.id} className="p-6 hover:bg-gray-50">
                                <div className="flex flex-col md:flex-row md:items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-start">
                                            <div className="mt-1">
                                                {getStatusIcon(issue.status)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="flex items-center flex-wrap gap-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {issue.title}
                                                    </h3>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(issue.priority)}`}>
                                                        {issue.priority === 'critical' ? 'Nghiêm trọng' :
                                                            issue.priority === 'high' ? 'Cao' :
                                                                issue.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mt-2">{issue.description}</p>
                                                <div className="flex items-center mt-4 text-sm text-gray-500">
                                                    <span>Báo cáo bởi: {issue.reportedBy}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>Ngày: {formatDate(issue.createdAt)}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>Loại: {issue.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex space-x-3">
                                        <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center">
                                            <Eye className="h-4 w-4 mr-2" />
                                            Chi tiết
                                        </button>
                                        <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center">
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Phản hồi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}