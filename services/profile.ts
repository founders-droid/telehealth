import { apiService, createFormData } from './api';
import { API_ENDPOINTS } from '../config/xano';
import { User, DoctorProfile, PatientProfile } from '../types';

export const profileService = {
  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return apiService.put<User>(API_ENDPOINTS.PROFILE.UPDATE, data);
  },

  // Upload profile photo
  uploadPhoto: async (file: any): Promise<User> => {
    const formData = createFormData({ photo: file });
    return apiService.upload<User>(API_ENDPOINTS.PROFILE.UPLOAD_PHOTO, formData);
  },

  // Get doctor profile
  getDoctorProfile: async (id: number): Promise<DoctorProfile> => {
    return apiService.get<DoctorProfile>(`${API_ENDPOINTS.PROFILE.DOCTOR}/${id}`);
  },

  // Update doctor profile
  updateDoctorProfile: async (data: Partial<DoctorProfile>): Promise<DoctorProfile> => {
    return apiService.put<DoctorProfile>(API_ENDPOINTS.PROFILE.DOCTOR, data);
  },

  // Update patient profile
  updatePatientProfile: async (data: Partial<PatientProfile>): Promise<PatientProfile> => {
    return apiService.put<PatientProfile>(API_ENDPOINTS.PROFILE.PATIENT, data);
  },
};
