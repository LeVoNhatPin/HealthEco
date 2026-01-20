// File: frontend/src/components/clinic/ClinicStats.tsx
import { MedicalFacility } from '@/types/clinic';

interface ClinicStatsProps {
    clinic: MedicalFacility;
}

export default function ClinicStats({ clinic }: ClinicStatsProps) {
    const stats = [
        {
            label: 'Bác sĩ',
            value: clinic.totalDoctors || 0,
            icon: '👨‍⚕️',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            label: 'Cuộc hẹn hôm nay',
            value: 12, // This should come from API
            icon: '📅',
            color: 'bg-green-100 text-green-600'
        },
        {
            label: 'Doanh thu tháng',
            value: '25.4M',
            icon: '💰',
            color: 'bg-purple-100 text-purple-600'
        },
        {
            label: 'Đánh giá',
            value: clinic.totalReviews,
            icon: '⭐',
            color: 'bg-yellow-100 text-yellow-600'
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold mt-2">{stat.value}</p>
                        </div>
                        <div className={`h-12 w-12 ${stat.color.split(' ')[0]} rounded-full flex items-center justify-center`}>
                            <span className="text-xl">{stat.icon}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}