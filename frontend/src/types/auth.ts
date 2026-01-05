export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'Patient' | 'Doctor' | 'ClinicAdmin' | 'SystemAdmin';
  phoneNumber?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  isActive: boolean;
  isEmailVerified?: boolean;
  themePreference?: string;
  languagePreference?: string;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    refreshToken: string;
    user: User;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  role: 'Patient' | 'Doctor' | 'ClinicAdmin';
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  medicalLicense?: string;
  specializationId?: number;
  yearsExperience?: number;
  qualifications?: string;
  bio?: string;
  consultationFee?: number;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    refreshToken: string;
    user: User;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}