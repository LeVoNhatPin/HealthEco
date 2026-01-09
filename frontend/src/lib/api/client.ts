    import axios from "axios";

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

    const apiClient = axios.create({
        baseURL: API_URL,
        headers: {
            "Content-Type": "application/json",
        },
    });


    // Request interceptor
    apiClient.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("healtheco_token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor
    apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refreshToken = localStorage.getItem(
                        "healtheco_refresh_token"
                    );
                    const token = localStorage.getItem("healtheco_token");

                    if (token && refreshToken) {
                        const response = await apiClient.post(
                            "/api/v1/auth/refresh",
                            {
                                token,
                                refreshToken,
                            }
                        );

                        const newToken = response.data.data.token;
                        const newRefreshToken = response.data.data.refreshToken;

                        localStorage.setItem("healtheco_token", newToken);
                        localStorage.setItem(
                            "healtheco_refresh_token",
                            newRefreshToken
                        );

                        apiClient.defaults.headers.common[
                            "Authorization"
                        ] = `Bearer ${newToken}`;
                        originalRequest.headers[
                            "Authorization"
                        ] = `Bearer ${newToken}`;

                        return apiClient(originalRequest);
                    }
                } catch (refreshError) {
                    localStorage.removeItem("healtheco_token");
                    localStorage.removeItem("healtheco_refresh_token");
                    localStorage.removeItem("healtheco_user");
                    window.location.href = "/dang-nhap";
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    export default apiClient;
