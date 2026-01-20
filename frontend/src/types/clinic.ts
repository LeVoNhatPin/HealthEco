// frontend/src/types/clinic.ts
import {
    FacilityType,
    DoctorFacilityWorkType,
    DoctorFacilityWorkStatus
} from './enums';


export interface MedicalFacility {
    id: number;
    name: string;
    code: string;
    facilityType: string;
    ownerId: number;
    owner?: any; // Will import Doctor type if exists
    licenseNumber: string;
    licenseImageUrl?: string;
    address: string;
    city: string;
    phone: string;
    email?: string;
    operatingHours: string;
    services: string;
    description?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    isActive: boolean;
    isVerified: boolean;
    rating: number;
    totalReviews: number;
    createdAt: string;
    updatedAt: string;

    // Calculated fields
    totalDoctors?: number;
    totalAppointments?: number;
}

export interface DoctorFacilityWork {
    id: number;
    doctorId: number;
    facilityId: number;
    workType: string;
    status: string;
    consultationFee?: number;
    contractStartDate?: string;
    contractEndDate?: string;
    workingHours?: string;
    createdAt: string;
    updatedAt: string;

    // Navigation properties
    doctor?: any;
    facility?: MedicalFacility;
}

export interface MedicalFacilityRequest {
    name: string;
    facilityType: string;
    licenseNumber: string;
    licenseImageUrl?: string;
    address: string;
    city: string;
    phone: string;
    email?: string;
    operatingHours?: string;
    services?: string;
    description?: string;
    avatarUrl?: string;
    bannerUrl?: string;
}

export interface DoctorFacilityWorkRequest {
    doctorId: number;
    facilityId: number;
    workType: string;
    consultationFee?: number;
    contractStartDate?: string;
    contractEndDate?: string;
    workingHours?: string;
}

export interface ClinicSearchParams {
    searchTerm?: string;
    facilityType?: string;
    city?: string;
    service?: string;
    isVerified?: boolean;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDescending?: boolean;
}
export interface DoctorFacilityWorkStatusRequest {
    status: string;
}
