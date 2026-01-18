// frontend/src/services/admin.service.ts
import apiClient from '@/lib/api/client';

export const adminService = {
    // ================= SYSTEM STATS =================
    getSystemStats: async () => {
        try {
            const response = await apiClient.get('/api/v1/admin/stats');
            return response.data;
        } catch (error: any) {
            console.error('Error fetching system stats:', error);
            throw error.response?.data || { success: false, message: 'Lỗi tải thống kê hệ thống' };
        }
    },

    // ================= USER MANAGEMENT =================
    getUsers: async (params?: any) => {
        try {
            const response = await apiClient.get('/api/v1/admin/users', { params });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching users:', error);
            throw error.response?.data || { success: false, message: 'Lỗi tải danh sách người dùng' };
        }
    },

    updateUserStatus: async (userId: number, status: boolean) => {
        try {
            const response = await apiClient.patch(`/api/v1/admin/users/${userId}/status`, { isActive: status });
            return response.data;
        } catch (error: any) {
            console.error('Error updating user status:', error);
            throw error.response?.data || { success: false, message: 'Lỗi cập nhật trạng thái' };
        }
    },

    // ================= DOCTOR MANAGEMENT =================
    getDoctors: async (params?: any) => {
        try {
            const response = await apiClient.get('/api/v1/admin/doctors', { params });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching doctors:', error);
            throw error.response?.data || { success: false, message: 'Lỗi tải danh sách bác sĩ' };
        }
    },

    updateDoctorVerification: async (doctorId: number, verified: boolean) => {
        try {
            const response = await apiClient.patch(`/api/v1/admin/doctors/${doctorId}/verification`, { isVerified: verified });
            return response.data;
        } catch (error: any) {
            console.error('Error updating doctor verification:', error);
            throw error.response?.data || { success: false, message: 'Lỗi cập nhật xác minh' };
        }
    },

    // ================= CLINIC MANAGEMENT =================
    getClinics: async (params?: any) => {
        try {
            const response = await apiClient.get('/api/v1/admin/clinics', { params });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching clinics:', error);
            throw error.response?.data || { success: false, message: 'Lỗi tải danh sách phòng khám' };
        }
    },

    updateClinicStatus: async (clinicId: number, status: boolean) => {
        try {
            const response = await apiClient.patch(`/api/v1/admin/clinics/${clinicId}/status`, { isActive: status });
            return response.data;
        } catch (error: any) {
            console.error('Error updating clinic status:', error);
            throw error.response?.data || { success: false, message: 'Lỗi cập nhật trạng thái phòng khám' };
        }
    },

    // ================= APPOINTMENT MANAGEMENT =================
    getAppointments: async (params?: any) => {
        try {
            const response = await apiClient.get('/api/v1/admin/appointments', { params });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching appointments:', error);
            throw error.response?.data || { success: false, message: 'Lỗi tải danh sách cuộc hẹn' };
        }
    }
};