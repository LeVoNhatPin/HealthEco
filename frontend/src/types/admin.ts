// frontend/src/types/admin.ts
export interface SystemStats {
    totalUsers: number;
    totalDoctors: number;
    totalClinics: number;
    totalAppointments: number;
    monthlyRevenue: number;
    pendingVerifications: number;
}

export interface User {
    id: number;
    email: string;
    fullName: string;
    role: string;
    phoneNumber?: string;
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: string;
}

export interface Doctor {
    id: number;
    userId: number;
    medicalLicense: string;
    isVerified: boolean;
    consultationFee: number;
    rating: number;
    user: User;
}

export interface Clinic {
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    isActive: boolean;
    createdAt: string;
}

export interface AdminResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    pagination?: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}
