// frontend/src/types/admin.ts
export interface SystemStats {
    totalUsers: number;
    activeUsers: number;
    patients: number;
    doctors: number;
    admins: number;
    inactiveUsers: number;
}

export interface User {
    id: number;
    email: string;
    fullName: string;
    role: string;
    phoneNumber: string;
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
    totalReviews: number;
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
