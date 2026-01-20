import { DoctorRegisterRequest } from "@/types/doctor";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://healtheco-production.up.railway.app";

// Helper fetch có xử lý lỗi
async function fetchJson(url: string, options?: RequestInit) {
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options?.headers || {}),
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
    }

    return res.json();
}

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

        return fetchJson(`${API_URL}/api/Doctors/register`, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    // ================= PUBLIC =================
    getDoctors: async (params?: Record<string, any>) => {
        const query = params
            ? "?" + new URLSearchParams(params).toString()
            : "";
        return fetchJson(`${API_URL}/api/Doctors${query}`);
    },

    getDoctor: async (id: number) => {
        return fetchJson(`${API_URL}/api/Doctors/${id}`);
    },

    getSpecializations: async () => {
        return fetchJson(`${API_URL}/api/Specializations`);
    },

    // ================= DOCTOR DASHBOARD =================
    getDoctorStats: async (doctorId: number) => {
        return fetchJson(
            `${API_URL}/api/Doctors/${doctorId}/stats`
        );
    },

    getDoctorAppointments: async (
        doctorId: number,
        params?: Record<string, any>
    ) => {
        const query = params
            ? "?" + new URLSearchParams(params).toString()
            : "";
        return fetchJson(
            `${API_URL}/api/Doctors/${doctorId}/appointments${query}`
        );
    },

    getDoctorPatients: async (
        doctorId: number,
        params?: Record<string, any>
    ) => {
        const query = params
            ? "?" + new URLSearchParams(params).toString()
            : "";
        return fetchJson(
            `${API_URL}/api/Doctors/${doctorId}/patients${query}`
        );
    },

    getDoctorSchedule: async (doctorId: number) => {
        return fetchJson(
            `${API_URL}/api/Doctors/${doctorId}/schedule`
        );
    },

    updateDoctorProfile: async (doctorId: number, data: any) => {
        return fetchJson(
            `${API_URL}/api/Doctors/${doctorId}`,
            {
                method: "PUT",
                body: JSON.stringify(data),
            }
        );
    },

    // Lấy doctor theo userId
    getDoctorByUserId: async (userId: number) => {
        return fetchJson(
            `${API_URL}/api/Doctors/by-user/${userId}`
        );
    },
};
