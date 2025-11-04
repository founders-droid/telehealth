import { apiService } from './api';
import { API_ENDPOINTS } from '../config/xano';
import {
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentData
} from '../types';

export const appointmentsService = {
  // Create new appointment
  createAppointment: async (data: CreateAppointmentData): Promise<Appointment> => {
    return apiService.post<Appointment>(API_ENDPOINTS.APPOINTMENTS.CREATE, data);
  },

  // Get all appointments for current user
  getAppointments: async (): Promise<Appointment[]> => {
    return apiService.get<Appointment[]>(API_ENDPOINTS.APPOINTMENTS.LIST);
  },

  // Get upcoming appointments
  getUpcomingAppointments: async (): Promise<Appointment[]> => {
    return apiService.get<Appointment[]>(API_ENDPOINTS.APPOINTMENTS.UPCOMING);
  },

  // Get appointment by ID
  getAppointmentById: async (id: number): Promise<Appointment> => {
    return apiService.get<Appointment>(API_ENDPOINTS.APPOINTMENTS.DETAIL(id));
  },

  // Update appointment
  updateAppointment: async (
    id: number,
    data: UpdateAppointmentData
  ): Promise<Appointment> => {
    return apiService.put<Appointment>(API_ENDPOINTS.APPOINTMENTS.UPDATE(id), data);
  },

  // Cancel appointment
  cancelAppointment: async (id: number): Promise<Appointment> => {
    return apiService.delete<Appointment>(API_ENDPOINTS.APPOINTMENTS.CANCEL(id));
  },

  // Add consultation notes (doctor only)
  addConsultationNotes: async (id: number, notes: string): Promise<Appointment> => {
    return apiService.put<Appointment>(API_ENDPOINTS.APPOINTMENTS.NOTES(id), {
      consultation_notes: notes,
    });
  },
};
