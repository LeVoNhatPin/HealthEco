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

/* ================= AUTH RESPONSE ================= */

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

/* ================= REQUESTS ================= */

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
  dateOfBirth?: string;
  address?: string;
  city?: string;

  // Doctor specific fields
  medicalLicense?: string;
  specializationId?: number;
  yearsExperience?: number;
  qualifications?: string;
  bio?: string;
  consultationFee?: number;
}
