// frontend/src/types/doctor.ts
export interface Specialization {
    id: number;
    name: string;
    description: string;
    iconUrl: string;
    isActive: boolean;
}

export interface Doctor {
    id: number;
    userId: number;
    medicalLicense: string;
    licenseImageUrl: string;
    specializationId: number;
    specialization?: Specialization;
    yearsExperience: number;
    qualifications: string;
    bio: string;
    consultationFee: number;
    rating: number;
    totalReviews: number;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        email: string;
        fullName: string;
        role: string;
        phoneNumber?: string;
        dateOfBirth?: string;
        address?: string;
        city?: string;
        avatarUrl?: string;
        isActive: boolean;
        isEmailVerified: boolean;
        createdAt: string;
        updatedAt?: string;
    };
}

export interface DoctorRegisterRequest {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
    dateOfBirth?: string | null;
    address?: string;
    city?: string;
    medicalLicense: string;
    licenseImageUrl?: string;
    specializationId: number;
    yearsExperience: number;
    qualifications: string;
    bio?: string;
    consultationFee: number;
}

export interface DoctorUpdateRequest {
    medicalLicense?: string;
    licenseImageUrl?: string;
    specializationId?: number;
    yearsExperience: number;
    qualifications?: string;
    bio?: string;
    consultationFee: number;
}

export interface DoctorSearchParams {
    searchTerm?: string;
    specializationId?: number;
    city?: string;
    minFee?: number;
    maxFee?: number;
    isVerified?: boolean;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDescending?: boolean;
}
export interface SpecializationResponse {
    id: number;
    name: string;
    description: string;
    iconUrl: string;
    isActive: boolean;
}
export interface DoctorResponse {
    id: number;
    userId: number;
    medicalLicense: string;
    licenseImageUrl?: string;
    specializationId?: number;
    specialization?: SpecializationResponse;
    yearsExperience: number;
    qualifications: string;
    bio?: string;
    consultationFee: number;
    rating: number;
    totalReviews: number;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    user: UserResponse;
}
export interface UserResponse {
    id: number;
    email: string;
    fullName: string;
    role: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    avatarUrl?: string;
    isActive: boolean;
    isEmailVerified: boolean;
    themePreference?: string;
    languagePreference?: string;
    createdAt: string;
    updatedAt?: string;
}
