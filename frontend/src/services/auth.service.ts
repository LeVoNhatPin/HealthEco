import apiClient from '@/lib/api/client';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from '@/types/auth';

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/api/v1/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        localStorage.setItem('healtheco_token', response.data.data.token);
        localStorage.setItem('healtheco_refresh_token', response.data.data.refreshToken);
        localStorage.setItem('healtheco_user', JSON.stringify(response.data.data.user));
        
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
      }
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Đã có lỗi xảy ra' };
    }
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<RegisterResponse>('/api/v1/auth/register', data);
      
      if (response.data.success && response.data.data) {
        localStorage.setItem('healtheco_token', response.data.data.token);
        localStorage.setItem('healtheco_refresh_token', response.data.data.refreshToken);
        localStorage.setItem('healtheco_user', JSON.stringify(response.data.data.user));
        
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
      }
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Đã có lỗi xảy ra' };
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } finally {
      this.clearAuth();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const userStr = localStorage.getItem('healtheco_user');
    if (userStr) return JSON.parse(userStr);

    try {
      const response = await apiClient.get<{ success: boolean; data: User }>('/api/v1/auth/me');
      if (response.data.success) {
        localStorage.setItem('healtheco_user', JSON.stringify(response.data.data));
        return response.data.data;
      }
      return null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('healtheco_token');
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('healtheco_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('healtheco_token');
  }

  clearAuth(): void {
    localStorage.removeItem('healtheco_token');
    localStorage.removeItem('healtheco_refresh_token');
    localStorage.removeItem('healtheco_user');
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

export const authService = AuthService.getInstance();