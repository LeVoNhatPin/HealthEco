// User type
export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
}

// Auth response types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Register request type
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
}

// Login request type
export interface LoginRequest {
  email: string;
  password: string;
}

// Refresh token request type
export interface RefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}