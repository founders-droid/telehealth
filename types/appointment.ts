import { User } from './user';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  patient?: User;
  doctor?: User;
  appointment_date: string;
  duration: number;
  status: AppointmentStatus;
  reason: string;
  amount: number;
  payment_status: PaymentStatus;
  payment_reference?: string;
  video_room_id?: string;
  consultation_notes?: string;
  created_at: string;
}

export interface CreateAppointmentData {
  doctor_id: number;
  appointment_date: string;
  duration: number;
  reason: string;
  amount: number;
}

export interface UpdateAppointmentData {
  status?: AppointmentStatus;
  consultation_notes?: string;
}

export interface AvailabilitySlot {
  id: number;
  doctor_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
