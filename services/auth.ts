import { apiService } from './api';
import { API_ENDPOINTS } from '../config/xano';
import {
  User,
  AuthResponse,
  LoginCredentials,
  SignupData,
} from '../types';

export const authService = {
  // Sign up a new user
  signup: async (data: SignupData): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, data);
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  // Logout user
  logout: async (): Promise<void> => {
    return apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  // Get current user profile
  getMe: async (): Promise<User> => {
    return apiService.get<User>(API_ENDPOINTS.AUTH.ME);
  },

  // Forgot password - Send reset link
  forgotPassword: async (email: string): Promise<void> => {
    return apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  // Reset password with token
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    return apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password: newPassword,
    });
  },
};
