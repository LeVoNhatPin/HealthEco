import api from "@/lib/api/client";
import {
    MedicalFacility,
    MedicalFacilityRequest,
    DoctorFacilityWorkRequest,
    ClinicSearchParams,
    DoctorFacilityWorkStatusRequest,
} from "@/types/clinic";

export const clinicService = {
    // ================= CLINIC =================

    registerClinic: async (data: MedicalFacilityRequest) => {
        const response = await api.post("/api/MedicalFacilities", data);
        return response.data;
    },

    getClinics: async (params?: ClinicSearchParams) => {
        const response = await api.get("/api/MedicalFacilities", { params });
        return response.data;
    },

    getClinic: async (id: number) => {
        const response = await api.get(`/api/MedicalFacilities/${id}`);
        return response.data;
    },

    updateClinic: async (id: number, data: Partial<MedicalFacilityRequest>) => {
        const response = await api.put(`/api/MedicalFacilities/${id}`, data);
        return response.data;
    },

    verifyClinic: async (id: number, isVerified: boolean) => {
        const response = await api.put(
            `/api/MedicalFacilities/${id}/verify`,
            { isVerified }
        );
        return response.data;
    },

    getMyClinics: async () => {
        const response = await api.get("/api/MedicalFacilities/my-clinics");
        return response.data;
    },

    // ================= DOCTOR – FACILITY =================

    addDoctorToClinic: async (
        clinicId: number,
        data: DoctorFacilityWorkRequest,
    ) => {
        const response = await api.post(
            `/api/MedicalFacilities/${clinicId}/doctors`,
            data,
        );
        return response.data;
    },

    getClinicDoctors: async (clinicId: number) => {
        const response = await api.get(
            `/api/MedicalFacilities/${clinicId}/doctors`,
        );
        return response.data;
    },

    updateDoctorFacilityWorkStatus: async (
        id: number,
        data: DoctorFacilityWorkStatusRequest,
    ) => {
        const response = await api.put(
            `/api/DoctorFacilityWorks/${id}/status`,
            data,
        );
        return response.data;
    },

    // ================= UTILS =================

    parseOperatingHours: (json: string) => {
        try {
            return JSON.parse(json);
        } catch {
            return {};
        }
    },

    parseServices: (json: string) => {
        try {
            return JSON.parse(json);
        } catch {
            return [];
        }
    },
};
