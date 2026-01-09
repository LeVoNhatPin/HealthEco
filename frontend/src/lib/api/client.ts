import axios from "axios";

/**
 * Lấy API URL an toàn (client-only)
 */
const getApiUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL;

    if (!url) {
        if (process.env.NODE_ENV === "development") {
            console.warn("⚠️ NEXT_PUBLIC_API_URL is not defined");
        }
        return "";
    }

    return url;
};

const apiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * REQUEST INTERCEPTOR
 */
apiClient.interceptors.request.use(
    (config) => {
        // ✅ GÁN baseURL TẠI THỜI ĐIỂM REQUEST
        if (!config.baseURL) {
            config.baseURL = getApiUrl();
        }

        const isAuthEndpoint =
            config.url?.includes("/auth/login") ||
            config.url?.includes("/auth/register") ||
            config.url?.includes("/auth/refresh");

        if (!isAuthEndpoint && typeof window !== "undefined") {
            const token = localStorage.getItem("healtheco_token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 */
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (typeof window === "undefined") {
            return Promise.reject(error);
        }

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/login") &&
            !originalRequest.url?.includes("/auth/register")
        ) {
            originalRequest._retry = true;

            try {
                const token = localStorage.getItem("healtheco_token");
                const refreshToken = localStorage.getItem(
                    "healtheco_refresh_token"
                );

                if (!token || !refreshToken) {
                    throw new Error("Missing tokens");
                }

                // ✅ DÙNG CHÍNH apiClient
                const res = await apiClient.post("/api/v1/auth/refresh", {
                    token,
                    refreshToken,
                });

                const newToken = res.data.data.token;
                const newRefreshToken = res.data.data.refreshToken;

                localStorage.setItem("healtheco_token", newToken);
                localStorage.setItem(
                    "healtheco_refresh_token",
                    newRefreshToken
                );

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            } catch (err) {
                localStorage.clear();
                window.location.href = "/dang-nhap";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
