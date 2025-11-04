export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  phone: string;
  profile_photo?: string;
  is_verified: boolean;
  created_at: string;
}

export interface DoctorProfile {
  id: number;
  user_id: number;
  user?: User;
  specialty: string;
  license_number: string;
  years_experience: number;
  bio: string;
  consultation_fee: number;
  credentials?: string[];
  is_approved: boolean;
  rating: number;
  total_consultations: number;
}

export interface PatientProfile {
  id: number;
  user_id: number;
  user?: User;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  blood_type?: string;
  allergies?: string;
  current_medications?: string;
  medical_history?: string;
}

export interface AuthResponse {
  authToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: UserRole;
}
