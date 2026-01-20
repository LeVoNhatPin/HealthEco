import apiClient from "@/lib/api/client";
import {
    MedicalFacilityRequest,
    DoctorFacilityWorkRequest,
    ClinicSearchParams,
    DoctorFacilityWorkStatusRequest,
} from "@/types/clinic";

export const clinicService = {
    // ================= CLINIC =================

    registerClinic: async (data: MedicalFacilityRequest) => {
        const res = await apiClient.post("/api/MedicalFacilities", data);
        return res.data;
    },

    getClinics: async (params?: ClinicSearchParams) => {
        const res = await apiClient.get("/api/MedicalFacilities", { params });
        return res.data;
    },

    getClinic: async (id: number) => {
        const res = await apiClient.get(`/api/MedicalFacilities/${id}`);
        return res.data;
    },

    updateClinic: async (id: number, data: Partial<MedicalFacilityRequest>) => {
        const res = await apiClient.put(`/api/MedicalFacilities/${id}`, data);
        return res.data;
    },

    verifyClinic: async (id: number, isVerified: boolean) => {
        const res = await apiClient.put(`/api/MedicalFacilities/${id}/verify`, {
            isVerified,
        });
        return res.data;
    },

    getMyClinics: async () => {
        const res = await apiClient.get("/api/MedicalFacilities/my-clinics");
        return res.data;
    },

    // ================= DOCTOR – FACILITY =================

    addDoctorToClinic: async (
        clinicId: number,
        data: DoctorFacilityWorkRequest,
    ) => {
        const res = await apiClient.post(
            `/api/MedicalFacilities/${clinicId}/doctors`,
            data,
        );
        return res.data;
    },

    getClinicDoctors: async (clinicId: number) => {
        const res = await apiClient.get(
            `/api/MedicalFacilities/${clinicId}/doctors`,
        );
        return res.data;
    },

    updateDoctorFacilityWorkStatus: async (
        id: number,
        data: DoctorFacilityWorkStatusRequest,
    ) => {
        const res = await apiClient.put(
            `/api/DoctorFacilityWorks/${id}/status`,
            data,
        );
        return res.data;
    },
};
