import { DoctorRegisterRequest } from "@/types/doctor";

// services/doctor.service.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://healtheco-production.up.railway.app';

export const doctorService = {
    register: async (data: DoctorRegisterRequest) => {
        const payload = {
            ...data,
            phoneNumber: data.phoneNumber || undefined,
            dateOfBirth: data.dateOfBirth
                ? new Date(data.dateOfBirth).toISOString()
                : null,  // Đổi từ undefined thành null
            address: data.address || undefined,
            city: data.city || undefined,
            licenseImageUrl: data.licenseImageUrl || undefined,
            bio: data.bio || undefined,
        };

        const response = await fetch(`${API_URL}/api/Doctors/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Registration failed:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        return response.json();
    },

    getDoctors: async (params?: any) => {
        const queryParams = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/api/Doctors?${queryParams}`);
        return response.json();
    },

    getDoctor: async (id: number) => {
        const response = await fetch(`${API_URL}/api/Doctors/${id}`);
        return response.json();
    },

    getSpecializations: async () => {
        const response = await fetch(`${API_URL}/api/Specializations`);
        return response.json();
    },
};