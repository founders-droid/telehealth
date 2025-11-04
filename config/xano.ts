// Xano API Configuration
export const XANO_CONFIG = {
  API_URL: process.env.EXPO_PUBLIC_XANO_API_URL || '',
  API_KEY: process.env.EXPO_PUBLIC_XANO_API_KEY || '',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // User Profile
  PROFILE: {
    UPDATE: '/profile',
    UPLOAD_PHOTO: '/profile/photo',
    DOCTOR: '/doctor/profile',
    PATIENT: '/patient/profile',
  },

  // Doctors
  DOCTORS: {
    LIST: '/doctors',
    SEARCH: '/doctors/search',
    DETAIL: (id: number) => `/doctors/${id}`,
    AVAILABILITY: (id: number) => `/doctors/${id}/availability`,
  },

  // Appointments
  APPOINTMENTS: {
    CREATE: '/appointments',
    LIST: '/appointments',
    DETAIL: (id: number) => `/appointments/${id}`,
    UPDATE: (id: number) => `/appointments/${id}`,
    CANCEL: (id: number) => `/appointments/${id}`,
    NOTES: (id: number) => `/appointments/${id}/notes`,
    UPCOMING: '/appointments/upcoming',
  },

  // Payments
  PAYMENTS: {
    INITIALIZE: '/payments/initialize',
    VERIFY: '/payments/verify',
    WEBHOOK: '/webhooks/paystack',
    HISTORY: '/payments/history',
  },

  // Messages
  MESSAGES: {
    SEND: '/messages',
    CONVERSATION: (userId: number) => `/messages/conversation/${userId}`,
    CONVERSATIONS: '/messages/conversations',
    MARK_READ: (id: number) => `/messages/${id}/read`,
  },

  // Medical Documents
  DOCUMENTS: {
    UPLOAD: '/documents',
    LIST: '/documents',
    PATIENT_DOCUMENTS: (patientId: number) => `/documents/${patientId}`,
    DELETE: (id: number) => `/documents/${id}`,
  },

  // Availability
  AVAILABILITY: {
    SET: '/availability',
    GET: '/availability',
    UPDATE: (id: number) => `/availability/${id}`,
    SLOTS: (doctorId: number, date: string) => `/availability/slots/${doctorId}?date=${date}`,
  },
};
