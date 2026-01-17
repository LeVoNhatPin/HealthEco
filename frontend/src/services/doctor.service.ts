// frontend/src/services/doctor.service.ts
import api from "@/lib/api/client";
import {
    Doctor,
    DoctorRegisterRequest,
    DoctorUpdateRequest,
    DoctorSearchParams,
} from "@/types/doctor";

export const doctorService = {
    register: async (data: DoctorRegisterRequest) => {
        const response = await api.post("/doctors/register", data);
        return response.data;
    },

    getDoctors: async (params?: DoctorSearchParams) => {
        const response = await api.get("/doctors", { params });
        return response.data;
    },

    getDoctor: async (id: number) => {
        const response = await api.get(`/doctors/${id}`);
        return response.data;
    },

    updateDoctor: async (id: number, data: DoctorUpdateRequest) => {
        const response = await api.put(`/doctors/${id}`, data);
        return response.data;
    },

    verifyDoctor: async (id: number, isVerified: boolean) => {
        const response = await api.put(`/doctors/${id}/verify`, { isVerified });
        return response.data;
    },

    getPendingDoctors: async () => {
        const response = await api.get("/doctors/pending");
        return response.data;
    },

    getSpecializations: async () => {
        const response = await api.get("/specializations");
        return response.data;
    },
};
