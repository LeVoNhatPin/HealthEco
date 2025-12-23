import { apiClient, ApiResponse } from '@/lib/api/client';

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  role: string;
  phoneNumber: string;
  avatarUrl: string;
  dateOfBirth: string | null;
  address: string;
  city: string;
  isActive: boolean;
  createdAt: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string | null;
  address: string;
  city: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateAvatarRequest {
  avatarUrl: string;
}

export interface UserList {
  id: number;
  email: string;
  fullName: string;
  role: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
  doctorId?: number;
  doctorSpecialization?: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalClinics: number;
  totalAppointments: number;
  todayAppointments: number;
  pendingApprovals: number;
  revenueThisMonth: number;
  activeUsers: number;
}

export interface UpdateUserStatusRequest {
  isActive: boolean;
  reason: string;
}

export interface UpdateUserRoleRequest {
  role: string;
}

export interface SearchUsersResponse {
  users: UserList[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const userService = {
  // Get current user profile
  getCurrentUser: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/api/users/me');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get user profile');
    }
    
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await apiClient.put<UserProfile>('/api/users/me', data);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update profile');
    }
    
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    const response = await apiClient.post<unknown>('/api/users/change-password', data);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to change password');
    }
  },

  // Update avatar
  updateAvatar: async (avatarUrl: string): Promise<{ avatarUrl: string }> => {
    const response = await apiClient.post<{ avatarUrl: string }>('/api/users/avatar', { avatarUrl });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update avatar');
    }
    
    return response.data;
  },

  // Admin: Get all users
  getAllUsers: async (): Promise<UserList[]> => {
    const response = await apiClient.get<UserList[]>('/api/users');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get users');
    }
    
    return response.data;
  },

  // Admin: Get user by ID
  getUserById: async (id: number): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>(`/api/users/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get user');
    }
    
    return response.data;
  },

  // Admin: Update user status
  updateUserStatus: async (id: number, data: UpdateUserStatusRequest): Promise<UserProfile> => {
    const response = await apiClient.put<UserProfile>(`/api/users/${id}/status`, data);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update user status');
    }
    
    return response.data;
  },

  // Admin: Update user role
  updateUserRole: async (id: number, role: string): Promise<UserProfile> => {
    const response = await apiClient.put<UserProfile>(`/api/users/${id}/role`, { role });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update user role');
    }
    
    return response.data;
  },

  // Admin: Search users
  searchUsers: async (params: {
    searchTerm?: string;
    role?: string;
    isActive?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<SearchUsersResponse> => {
    const response = await apiClient.get<SearchUsersResponse>('/api/admin/users/search', { params });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to search users');
    }
    
    return response.data;
  },

  // Admin: Get dashboard stats
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    const response = await apiClient.get<AdminDashboardStats>('/api/admin/dashboard/stats');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get dashboard stats');
    }
    
    return response.data;
  },
};