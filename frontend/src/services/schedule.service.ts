import api from "@/lib/api/client";

export const scheduleService = {
    createSchedule: async (data: any) => {
        const response = await api.post("/api/v1/schedule", data);
        return response.data;
    },

    getMySchedules: async () => {
        const response = await api.get("/api/v1/schedule/my-schedules");
        return response.data;
    },

    deleteSchedule: async (id: number) => {
        const response = await api.delete(`/api/v1/schedule/${id}`);
        return response.data;
    },
};
