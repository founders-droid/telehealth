import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User, UserRole } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { authService } from '../services/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
    role: UserRole;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loadUserFromStorage: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },

  setToken: (token) => {
    set({ token });
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const response = await authService.login({ email, password });

      // Store token and user data securely
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, response.authToken);
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_ROLE, response.user.role);

      set({
        user: response.user,
        token: response.authToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Login failed',
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  signup: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const response = await authService.signup(data);

      // Store token and user data securely
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, response.authToken);
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_ROLE, response.user.role);

      set({
        user: response.user,
        token: response.authToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Signup failed',
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      // Call logout API
      await authService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API success
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_ROLE);

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  loadUserFromStorage: async () => {
    try {
      set({ isLoading: true });

      const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);

      if (token && userData) {
        const user = JSON.parse(userData);

        // Verify token is still valid by fetching current user
        try {
          const currentUser = await authService.getMe();
          set({
            user: currentUser,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Token is invalid, clear storage
          await get().logout();
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      set({ isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
