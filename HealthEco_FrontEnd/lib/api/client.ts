import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import { 
  AuthResponse, 
  RegisterRequest, 
  LoginRequest, 
  RefreshTokenRequest,
  User 
} from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://health-eco-backend.railway.app';

class ApiClient {
  private client: AxiosInstance;
  private refreshTokenRequest: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and not a refresh token request
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newAccessToken = await this.refreshAccessToken();
            this.setAccessToken(newAccessToken);
            
            // Retry the original request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh token failed, logout user
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshAccessToken(): Promise<string> {
    // Prevent multiple refresh requests
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }

    this.refreshTokenRequest = new Promise(async (resolve, reject) => {
      try {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post<AuthResponse>(`${API_URL}/api/auth/refresh-token`, {
          accessToken: this.getAccessToken(),
          refreshToken,
        } as RefreshTokenRequest);

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // Store new tokens
        this.setAccessToken(accessToken);
        this.setRefreshToken(newRefreshToken);

        resolve(accessToken);
      } catch (error) {
        reject(error);
      } finally {
        this.refreshTokenRequest = null;
      }
    });

    return this.refreshTokenRequest;
  }

  // Token management methods
  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  private setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  private setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', token);
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // Public methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Auth specific methods
  public async login(loginData: LoginRequest): Promise<AuthResponse> {
    return this.post<AuthResponse>('/api/auth/login', loginData);
  }

  public async register(registerData: RegisterRequest): Promise<AuthResponse> {
    return this.post<AuthResponse>('/api/auth/register', registerData);
  }

  public async logout(): Promise<void> {
    this.clearTokens();
    return this.post('/api/auth/logout');
  }

  public isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const apiClient = new ApiClient();