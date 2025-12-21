'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, User, RegisterRequest } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    if (!apiClient.isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    try {
      // Try to get user info from token first
      const userFromToken = apiClient.getCurrentUserFromToken();
      setUser(userFromToken);

      // Then validate with server
      const response = await apiClient.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        // Token might be invalid, clear it
        apiClient.clearTokens();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      apiClient.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting login for:', email);
      const response = await apiClient.login({ email, password });
      
      if (response.success && response.data) {
        console.log('Login successful, setting tokens');
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setUser(response.data.user);
        toast.success('Login successful!');
        
        // Redirect based on role
        const role = response.data.user.role;
        if (role === 'Patient') {
          router.push('/dashboard/patient');
        } else if (role === 'Doctor') {
          router.push('/dashboard/doctor');
        } else if (role === 'ClinicAdmin') {
          router.push('/dashboard/clinic');
        } else {
          router.push('/dashboard');
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Login failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      console.log('Attempting registration for:', data.email);
      const response = await apiClient.register(data);
      
      if (response.success && response.data) {
        console.log('Registration successful, setting tokens');
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setUser(response.data.user);
        toast.success('Registration successful!');
        
        // Redirect patient to their dashboard
        if (response.data.user.role === 'Patient') {
          router.push('/dashboard/patient');
        } else {
          router.push('/dashboard');
        }
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Registration failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      apiClient.clearTokens();
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/login');
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};