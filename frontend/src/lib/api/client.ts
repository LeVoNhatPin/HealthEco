import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const refreshClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

/* ================= REQUEST ================= */
apiClient.interceptors.request.use((config) => {
    const isAuthEndpoint =
        config.url?.includes("/api/auth/login") ||
        config.url?.includes("/api/auth/register") ||
        config.url?.includes("/api/auth/refresh");

    if (!isAuthEndpoint && typeof window !== "undefined") {
        const token = localStorage.getItem("healtheco_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

/* ================= RESPONSE ================= */
apiClient.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            error.response?.data?.code === "TOKEN_EXPIRED" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const token = localStorage.getItem("healtheco_token");
            const refreshToken = localStorage.getItem("healtheco_refresh_token");

            if (!token || !refreshToken) {
                window.location.href = "/dang-nhap";
                return Promise.reject(error);
            }

            const res = await refreshClient.post("/api/auth/refresh", {
                token,
                refreshToken,
            });

            const newToken = res.data?.token;
            const newRefreshToken = res.data?.refreshToken;

            localStorage.setItem("healtheco_token", newToken);
            localStorage.setItem("healtheco_refresh_token", newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
