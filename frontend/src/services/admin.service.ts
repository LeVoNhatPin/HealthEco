// frontend/src/services/admin.service.ts
import api from "@/lib/api/client";

export const adminService = {
    // Thống kê hệ thống
    getSystemStats: async () => {
        try {
            const response = await api.get("/api/v1/admin/statistics");
            return response.data;
        } catch (error: any) {
            console.error("Error fetching system stats:", error);
            throw (
                error.response?.data || {
                    success: false,
                    message: "Lỗi tải thống kê hệ thống",
                }
            );
        }
    },

    // Quản lý người dùng
    getUsers: async (params?: any) => {
        try {
            const response = await api.get("/api/v1/admin/users", { params });
            return response.data;
        } catch (error: any) {
            console.error("Error fetching users:", error);
            throw (
                error.response?.data || {
                    success: false,
                    message: "Lỗi tải danh sách người dùng",
                }
            );
        }
    },

    getUserById: async (id: number) => {
        try {
            const response = await api.get(`/api/v1/admin/users/${id}`);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching user:", error);
            throw (
                error.response?.data || {
                    success: false,
                    message: "Lỗi tải thông tin người dùng",
                }
            );
        }
    },

    updateUserStatus: async (id: number, isActive: boolean) => {
        try {
            const response = await api.put(`/api/v1/admin/users/${id}/status`, {
                isActive,
            });
            return response.data;
        } catch (error: any) {
            console.error("Error updating user status:", error);
            throw (
                error.response?.data || {
                    success: false,
                    message: "Lỗi cập nhật trạng thái",
                }
            );
        }
    },

    // Quản lý bác sĩ
    getDoctors: async (params?: any) => {
        try {
            const response = await api.get("/api/v1/admin/doctors", { params });
            return response.data;
        } catch (error: any) {
            console.error("Error fetching doctors:", error);
            throw (
                error.response?.data || {
                    success: false,
                    message: "Lỗi tải danh sách bác sĩ",
                }
            );
        }
    },

    verifyDoctor: async (id: number, isVerified: boolean) => {
        try {
            const response = await api.put(
                `/api/v1/admin/doctors/${id}/verify`,
                { isVerified },
            );
            return response.data;
        } catch (error: any) {
            console.error("Error verifying doctor:", error);
            throw (
                error.response?.data || {
                    success: false,
                    message: "Lỗi xác minh bác sĩ",
                }
            );
        }
    },

    // Quản lý phòng khám
    getClinics: async (params?: any) => {
        try {
            const response = await api.get("/api/v1/admin/clinics", { params });
            return response.data;
        } catch (error: any) {
            console.error("Error fetching clinics:", error);
            throw (
                error.response?.data || {
                    success: false,
                    message: "Lỗi tải danh sách phòng khám",
                }
            );
        }
    },

    // Xác minh
    getPendingVerifications: async () => {
        try {
            const response = await api.get(
                "/api/v1/admin/verifications/pending",
            );
            return response.data;
        } catch (error: any) {
            console.error("Error fetching pending verifications:", error);
            throw (
                error.response?.data || {
                    success: false,
                    message: "Lỗi tải danh sách chờ xác minh",
                }
            );
        }
    },
};
