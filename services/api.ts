import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { XANO_CONFIG } from '../config/xano';
import { STORAGE_KEYS } from '../utils/constants';
import { ApiError, ApiResponse } from '../types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: XANO_CONFIG.API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add API key if configured
      if (XANO_CONFIG.API_KEY) {
        config.headers['X-API-Key'] = XANO_CONFIG.API_KEY;
      }

      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const apiError: ApiError = {
      message: 'An error occurred',
      status: error.response?.status,
    };

    if (error.response) {
      // Server responded with error
      apiError.message = error.response.data?.message || error.message;
      apiError.code = error.response.data?.code;

      // Handle 401 Unauthorized - Clear auth and redirect to login
      if (error.response.status === 401) {
        try {
          await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
          await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
          // You can also trigger a navigation to login here if needed
        } catch (clearError) {
          console.error('Error clearing auth data:', clearError);
        }
      }
    } else if (error.request) {
      // Request was made but no response
      apiError.message = 'No response from server. Please check your internet connection.';
    } else {
      // Something else happened
      apiError.message = error.message;
    }

    return Promise.reject(apiError);
  }
);

// Helper function to handle file uploads
export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, value);
      }
    }
  });

  return formData;
};

// Generic API methods
export const apiService = {
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get<ApiResponse<T>>(url, config);
    return response.data.data;
  },

  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  },

  // Upload file with multipart/form-data
  upload: async <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
    return response.data.data;
  },
};

export default api;
