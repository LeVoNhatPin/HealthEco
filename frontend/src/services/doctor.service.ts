// services/doctor.service.ts - THÊM TRƯỜNG dateOfBirth
import {
    DoctorRegisterRequest,
    DoctorResponse,
    SpecializationResponse,
} from "@/types/doctor";

export const doctorService = {
    register: async (data: DoctorRegisterRequest) => {
        // Convert date format if needed
        const payload = {
            ...data,
            phoneNumber: data.phoneNumber || undefined,
            dateOfBirth: data.dateOfBirth
                ? new Date(data.dateOfBirth).toISOString()
                : undefined,
            address: data.address || undefined,
            city: data.city || undefined,
            licenseImageUrl: data.licenseImageUrl || undefined,
            bio: data.bio || undefined,
        };

        const response = await fetch("/api/doctors/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        return response.json();
    },

    getDoctors: async (params?: any) => {
        const queryParams = new URLSearchParams(params).toString();
        const response = await fetch(`/api/doctors?${queryParams}`);
        return response.json();
    },

    getDoctor: async (id: number) => {
        const response = await fetch(`/api/doctors/${id}`);
        return response.json();
    },

    getSpecializations: async () => {
        const response = await fetch("/api/specializations");
        return response.json();
    },
};
