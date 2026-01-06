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
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string; 
  fullName: string;
  role: 'Patient' | 'Doctor' | 'ClinicAdmin';
  phoneNumber?: string;
  dateOfBirth?: string; // ISO yyyy-MM-dd
  address?: string;
  city?: string;
}
