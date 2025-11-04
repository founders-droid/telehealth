// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (minimum 8 characters, at least one letter and one number)
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation (Nigerian format)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^0[789][01]\d{8}$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(cleaned);
};

// License number validation (basic check)
export const isValidLicenseNumber = (license: string): boolean => {
  return license.trim().length >= 5;
};

// Check if date is in the future
export const isFutureDate = (date: string | Date): boolean => {
  const now = new Date();
  const checkDate = new Date(date);
  return checkDate > now;
};

// Check if date is in the past
export const isPastDate = (date: string | Date): boolean => {
  const now = new Date();
  const checkDate = new Date(date);
  return checkDate < now;
};

// Validate consultation fee (must be positive number)
export const isValidConsultationFee = (fee: number): boolean => {
  return fee > 0 && fee < 1000000; // Max 1 million naira
};

// Validate years of experience
export const isValidYearsExperience = (years: number): boolean => {
  return years >= 0 && years <= 70;
};

// Check if file size is within limit (in bytes)
export const isValidFileSize = (size: number, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size <= maxSizeBytes;
};

// Check if file type is allowed
export const isValidFileType = (
  mimeType: string,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
): boolean => {
  return allowedTypes.includes(mimeType);
};

// Validate bio length
export const isValidBio = (bio: string): boolean => {
  return bio.trim().length >= 50 && bio.trim().length <= 1000;
};

// Get password strength
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 8) {
    return 'weak';
  }

  let strength = 0;

  // Check for lowercase letters
  if (/[a-z]/.test(password)) strength++;

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) strength++;

  // Check for numbers
  if (/\d/.test(password)) strength++;

  // Check for special characters
  if (/[@$!%*#?&]/.test(password)) strength++;

  if (strength <= 2) {
    return 'weak';
  } else if (strength === 3) {
    return 'medium';
  } else {
    return 'strong';
  }
};

// Validation error messages
export const VALIDATION_ERRORS = {
  email: 'Please enter a valid email address',
  password: 'Password must be at least 8 characters with letters and numbers',
  phone: 'Please enter a valid Nigerian phone number',
  required: 'This field is required',
  license: 'Please enter a valid license number',
  fee: 'Please enter a valid consultation fee',
  experience: 'Please enter valid years of experience',
  bio: 'Bio must be between 50 and 1000 characters',
  fileSize: 'File size exceeds the maximum limit',
  fileType: 'Invalid file type',
};
