import api from "@/lib/api/client";

export const appointmentService = {
    // Đặt lịch
    bookAppointment: async (data: any) => {
        const response = await api.post("/api/appointment", data);
        return response.data;
    },

    // Lấy lịch hẹn của tôi
    getMyAppointments: async (status?: string) => {
        const params: any = {};
        if (status) params.status = status;

        const response = await api.get("/api/appointment/my-appointments", {
            params,
        });
        return response.data;
    },

    // Cập nhật trạng thái
    updateStatus: async (id: number, status: string) => {
        const response = await api.put(`/api/appointment/${id}/status`, {
            status,
        });
        return response.data;
    },

    // Hủy lịch
    cancelAppointment: async (id: number) => {
        const response = await api.delete(`/api/appointment/${id}`);
        return response.data;
    },

    // Lấy chi tiết lịch hẹn
    getAppointment: async (id: number) => {
        const response = await api.get(`/api/appointment/${id}`);
        return response.data;
    },
};
