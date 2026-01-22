// frontend/src/services/schedule.service.ts
import api from "@/lib/api/client";

export const scheduleService = {
    // ==============================
    // Tạo lịch trực (Doctor)
    // POST: /api/v1/schedule
    // ==============================
    createSchedule: async (data: any) => {
        const response = await api.post("/api/v1/schedule", data);
        return response.data;
    },

    // ==============================
    // Lấy lịch trực của bác sĩ (ADMIN / PUBLIC nếu có)
    // GET: /api/v1/schedule/doctor/{doctorId}
    // ⚠️ backend chưa có thì tạm thời đừng gọi
    // ==============================
    getDoctorSchedules: async (doctorId: number) => {
        const response = await api.get(`/api/v1/schedule/doctor/${doctorId}`);
        return response.data;
    },

    // ==============================
    // Lấy lịch trực của tôi (Doctor)
    // GET: /api/v1/schedule/my-schedules
    // ==============================
    getMySchedules: async () => {
        const response = await api.get("/api/v1/schedule/my-schedules");
        return response.data;
    },

    // ==============================
    // Lấy slots khả dụng
    // GET: /api/v1/schedule/available-slots
    // ==============================
    getAvailableSlots: async (
        doctorId: number,
        facilityId: number,
        date: string,
    ) => {
        const response = await api.get(
            "/api/v1/schedule/available-slots",
            {
                params: {
                    doctorId,
                    facilityId,
                    date,
                },
            }
        );
        return response.data;
    },

    // ==============================
    // Cập nhật lịch
    // PUT: /api/v1/schedule/{id}
    // ==============================
    updateSchedule: async (id: number, data: any) => {
        const response = await api.put(`/api/v1/schedule/${id}`, data);
        return response.data;
    },

    // ==============================
    // Xóa lịch
    // DELETE: /api/v1/schedule/{id}
    // ==============================
    deleteSchedule: async (id: number) => {
        const response = await api.delete(`/api/v1/schedule/${id}`);
        return response.data;
    },
};
