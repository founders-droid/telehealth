import { apiService } from './api';
import { API_ENDPOINTS } from '../config/xano';
import { DoctorProfile, AvailabilitySlot, TimeSlot } from '../types';

export const doctorsService = {
  // Get all verified doctors
  getDoctors: async (params?: {
    specialty?: string;
    search?: string;
  }): Promise<DoctorProfile[]> => {
    const queryParams = new URLSearchParams();

    if (params?.specialty) {
      queryParams.append('specialty', params.specialty);
    }

    if (params?.search) {
      queryParams.append('q', params.search);
    }

    const url = `${API_ENDPOINTS.DOCTORS.LIST}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return apiService.get<DoctorProfile[]>(url);
  },

  // Search doctors
  searchDoctors: async (query: string): Promise<DoctorProfile[]> => {
    return apiService.get<DoctorProfile[]>(`${API_ENDPOINTS.DOCTORS.SEARCH}?q=${query}`);
  },

  // Get doctor by ID
  getDoctorById: async (id: number): Promise<DoctorProfile> => {
    return apiService.get<DoctorProfile>(API_ENDPOINTS.DOCTORS.DETAIL(id));
  },

  // Get doctor's availability schedule
  getDoctorAvailability: async (id: number): Promise<AvailabilitySlot[]> => {
    return apiService.get<AvailabilitySlot[]>(API_ENDPOINTS.DOCTORS.AVAILABILITY(id));
  },

  // Get available time slots for a specific date
  getAvailableSlots: async (doctorId: number, date: string): Promise<TimeSlot[]> => {
    return apiService.get<TimeSlot[]>(API_ENDPOINTS.AVAILABILITY.SLOTS(doctorId, date));
  },
};
