import axios from "axios";

/**
 * =========================
 * GET API URL
 * =========================
 * Production:
 *   https://healtheco-production.up.railway.app/api
 * Local:
 *   http://localhost:5000/api
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

/**
 * =========================
 * AXIOS MAIN CLIENT
 * =========================
 */
const apiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * =========================
 * AXIOS REFRESH CLIENT
 * (❌ NO interceptor)
 * =========================
 */
const refreshClient = axios.create({
    baseURL: getApiUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * =========================
 * REQUEST INTERCEPTOR
 * =========================
 */
apiClient.interceptors.request.use(
    (config) => {
        // ✅ GÁN baseURL ĐÚNG THỜI ĐIỂM
        if (!config.baseURL) {
            config.baseURL = getApiUrl();
        }

        const isAuthEndpoint =
            config.url?.includes("/api/v1/auth/login") ||
            config.url?.includes("/api/v1/auth/register") ||
            config.url?.includes("/api/v1/auth/refresh");

        // ✅ CHỈ GẮN TOKEN KHI KHÔNG PHẢI AUTH API
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
 * =========================
 * RESPONSE INTERCEPTOR
 * =========================
 */
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (typeof window === "undefined") {
            return Promise.reject(error);
        }

        const status = error.response?.status;
        const originalRequest = error.config;

        // ❌ KHÔNG REFRESH cho 403 / 404 / 405
        if (status === 403 || status === 404 || status === 405) {
            return Promise.reject(error);
        }

        const isAuthEndpoint =
            originalRequest.url?.includes("/api/v1/auth/login") ||
            originalRequest.url?.includes("/api/v1/auth/register") ||
            originalRequest.url?.includes("/api/v1/auth/refresh");

        // ✅ REFRESH TOKEN KHI:
        // - 401
        // - chưa retry
        // - không phải auth endpoint
        if (
            status === 401 &&
            !originalRequest._retry &&
            !isAuthEndpoint
        ) {
            originalRequest._retry = true;

            try {
                const token = localStorage.getItem("healtheco_token");
                const refreshToken = localStorage.getItem(
                    "healtheco_refresh_token"
                );

                if (!token || !refreshToken) {
                    throw new Error("Missing token or refresh token");
                }

                // 🔁 GỌI REFRESH TOKEN
                const res = await refreshClient.post(
                    "/api/v1/auth/refresh",
                    { token, refreshToken }
                );

                const newToken = res.data?.data?.token;
                const newRefreshToken = res.data?.data?.refreshToken;

                if (!newToken || !newRefreshToken) {
                    throw new Error("Invalid refresh response");
                }

                // 💾 SAVE TOKEN MỚI
                localStorage.setItem("healtheco_token", newToken);
                localStorage.setItem(
                    "healtheco_refresh_token",
                    newRefreshToken
                );

                // 🔁 GỬI LẠI REQUEST CŨ
                originalRequest.headers.Authorization =
                    `Bearer ${newToken}`;

                return apiClient(originalRequest);
            } catch (err) {
                // ❌ REFRESH FAIL → LOGOUT
                localStorage.removeItem("healtheco_token");
                localStorage.removeItem("healtheco_refresh_token");
                window.location.href = "/dang-nhap";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
