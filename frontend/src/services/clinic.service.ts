// frontend/src/services/clinic.service.ts
import api from "@/lib/api/client";
import {
    MedicalFacility,
    MedicalFacilityRequest,
    DoctorFacilityWorkRequest,
    ClinicSearchParams,
    DoctorFacilityWorkStatusRequest,
} from "@/types/clinic";

export const clinicService = {
    // Clinic operations
    registerClinic: async (data: MedicalFacilityRequest) => {
        const response = await api.post("/medicalfacilities", data);
        return response.data;
    },

    getClinics: async (params?: ClinicSearchParams) => {
        const response = await api.get("/medicalfacilities", { params });
        return response.data;
    },

    getClinic: async (id: number) => {
        const response = await api.get(`/medicalfacilities/${id}`);
        return response.data;
    },

    updateClinic: async (id: number, data: Partial<MedicalFacilityRequest>) => {
        const response = await api.put(`/medicalfacilities/${id}`, data);
        return response.data;
    },

    verifyClinic: async (id: number, isVerified: boolean) => {
        const response = await api.put(`/medicalfacilities/${id}/verify`, {
            isVerified,
        });
        return response.data;
    },

    getMyClinics: async () => {
        const response = await api.get("/medicalfacilities/my-clinics");
        return response.data;
    },

    // Doctor-Facility operations
    addDoctorToClinic: async (
        clinicId: number,
        data: DoctorFacilityWorkRequest,
    ) => {
        const response = await api.post(
            `/medicalfacilities/${clinicId}/doctors`,
            data,
        );
        return response.data;
    },

    getClinicDoctors: async (clinicId: number) => {
        const response = await api.get(
            `/medicalfacilities/${clinicId}/doctors`,
        );
        return response.data;
    },

    updateDoctorFacilityWorkStatus: async (
        id: number,
        data: DoctorFacilityWorkStatusRequest,
    ) => {
        const response = await api.put(
            `/doctorfacilityworks/${id}/status`,
            data,
        );
        return response.data;
    },

    // Utility functions
    parseOperatingHours: (operatingHoursJson: string) => {
        try {
            return JSON.parse(operatingHoursJson);
        } catch {
            return {};
        }
    },

    parseServices: (servicesJson: string) => {
        try {
            return JSON.parse(servicesJson);
        } catch {
            return [];
        }
    },
};
