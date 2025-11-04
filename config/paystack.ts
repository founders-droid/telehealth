// Paystack Configuration
export const PAYSTACK_CONFIG = {
  PUBLIC_KEY: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
};

// Helper to generate unique payment reference
export const generatePaymentReference = (prefix = 'TH'): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `${prefix}-${timestamp}-${random}`;
};

// Convert amount to kobo (Paystack uses kobo, not naira)
export const convertToKobo = (amount: number): number => {
  return Math.round(amount * 100);
};

// Convert kobo to naira
export const convertFromKobo = (amount: number): number => {
  return amount / 100;
};
