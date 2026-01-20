import apiClient from "@/lib/api/client";
import { DoctorRegisterRequest } from "@/types/doctor";

export const doctorService = {
    // ================= REGISTER =================
    register: async (data: DoctorRegisterRequest) => {
        const payload = {
            ...data,
            phoneNumber: data.phoneNumber || undefined,
            dateOfBirth: data.dateOfBirth
                ? new Date(data.dateOfBirth).toISOString()
                : null,
            address: data.address || undefined,
            city: data.city || undefined,
            licenseImageUrl: data.licenseImageUrl || undefined,
            bio: data.bio || undefined,
        };

        const res = await apiClient.post(
            "/api/Doctors/register",
            payload
        );
        return res.data;
    },

    // ================= PUBLIC =================
    getDoctors: async (params?: Record<string, any>) => {
        const res = await apiClient.get("/api/Doctors", {
            params,
        });
        return res.data;
    },

    getDoctor: async (id: number) => {
        const res = await apiClient.get(`/api/Doctors/${id}`);
        return res.data;
    },

    getSpecializations: async () => {
        const res = await apiClient.get("/api/Specializations");
        return res.data;
    },

    // ================= DOCTOR DASHBOARD =================
    getDoctorStats: async (doctorId: number) => {
        const res = await apiClient.get(
            `/api/Doctors/${doctorId}/stats`
        );
        return res.data;
    },

    getDoctorAppointments: async (
        doctorId: number,
        params?: Record<string, any>
    ) => {
        const res = await apiClient.get(
            `/api/Doctors/${doctorId}/appointments`,
            { params }
        );
        return res.data;
    },

    getDoctorPatients: async (
        doctorId: number,
        params?: Record<string, any>
    ) => {
        const res = await apiClient.get(
            `/api/Doctors/${doctorId}/patients`,
            { params }
        );
        return res.data;
    },

    getDoctorSchedule: async (doctorId: number) => {
        const res = await apiClient.get(
            `/api/Doctors/${doctorId}/schedule`
        );
        return res.data;
    },

    updateDoctorProfile: async (
        doctorId: number,
        data: any
    ) => {
        const res = await apiClient.put(
            `/api/Doctors/${doctorId}`,
            data
        );
        return res.data;
    },

    // ================= UTILS =================
    getDoctorByUserId: async (userId: number) => {
        const res = await apiClient.get(
            `/api/Doctors/by-user/${userId}`
        );
        return res.data;
    },
};
