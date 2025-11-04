// App Constants
export const APP_NAME = 'Telehealth';
export const APP_VERSION = '1.0.0';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  USER_ROLE: 'user_role',
  THEME: 'theme',
};

// Medical Specialties
export const MEDICAL_SPECIALTIES = [
  'General Practice',
  'Internal Medicine',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Surgery',
  'Psychiatry',
  'Dermatology',
  'Ophthalmology',
  'Orthopedics',
  'Cardiology',
  'Neurology',
  'Urology',
  'ENT (Ear, Nose, Throat)',
  'Radiology',
  'Anesthesiology',
  'Emergency Medicine',
  'Family Medicine',
  'Oncology',
  'Endocrinology',
  'Gastroenterology',
  'Nephrology',
  'Pulmonology',
  'Rheumatology',
  'Allergy & Immunology',
];

// Gender Options
export const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

// Blood Type Options
export const BLOOD_TYPE_OPTIONS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

// Appointment Duration Options (in minutes)
export const APPOINTMENT_DURATIONS = [
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '45 minutes', value: 45 },
  { label: '60 minutes', value: 60 },
];

// Document Types
export const DOCUMENT_TYPES = [
  { label: 'Lab Result', value: 'lab_result' },
  { label: 'Prescription', value: 'prescription' },
  { label: 'Scan', value: 'scan' },
  { label: 'Other', value: 'other' },
];

// Days of Week
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
