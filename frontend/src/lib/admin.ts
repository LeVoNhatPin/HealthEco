import axiosClient from "../lib/api/client";

const adminApi = {
    getSystemStats: () => axiosClient.get("/admin/stats"),
    getUsers: (params?: any) => axiosClient.get("/admin/users", { params }),
    getUserById: (id: number) => axiosClient.get(`/admin/users/${id}`),
    updateUserStatus: (id: number, isActive: boolean) =>
        axiosClient.put(`/admin/users/${id}/status`, { isActive }),

    // ✅ THÊM CÁI NÀY
    getPendingDoctors: () => axiosClient.get("/admin/doctors/pending"),

    approveDoctor: (doctorId: number) =>
        axiosClient.put(`/admin/doctors/${doctorId}/approve`),

    rejectDoctor: (doctorId: number, reason: string) =>
        axiosClient.put(`/admin/doctors/${doctorId}/reject`, { reason }),

    getIssues: (params?: any) => axiosClient.get("/admin/issues", { params }),
};

export default adminApi;
