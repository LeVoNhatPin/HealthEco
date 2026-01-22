import api from "@/lib/api/client";

export const scheduleService = {
    // Tạo lịch trực
    createSchedule: async (data: any) => {
        const response = await api.post("/api/schedule", data);
        return response.data;
    },

    // Lấy lịch trực của bác sĩ
    getDoctorSchedules: async (doctorId: number) => {
        const response = await api.get(`/api/schedule/doctor/${doctorId}`);
        return response.data;
    },

    // Lấy lịch trực của tôi (doctor)
    getMySchedules: async () => {
        const response = await api.get("/api/schedule/my-schedules");
        return response.data;
    },

    // Lấy slots khả dụng
    getAvailableSlots: async (
        doctorId: number,
        facilityId: number,
        date: string,
    ) => {
        const response = await api.get(
            `/api/schedule/available-slots?doctorId=${doctorId}&facilityId=${facilityId}&date=${date}`,
        );
        return response.data;
    },

    // Xóa lịch trực
    deleteSchedule: async (id: number) => {
        const response = await api.delete(`/api/schedule/${id}`);
        return response.data;
    },
};
