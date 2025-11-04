import { apiService } from './api';
import { API_ENDPOINTS } from '../config/xano';
import {
  Payment,
  InitializePaymentData,
  InitializePaymentResponse,
  VerifyPaymentData,
} from '../types';

export const paymentsService = {
  // Initialize payment with Paystack
  initializePayment: async (
    data: InitializePaymentData
  ): Promise<InitializePaymentResponse> => {
    return apiService.post<InitializePaymentResponse>(
      API_ENDPOINTS.PAYMENTS.INITIALIZE,
      data
    );
  },

  // Verify payment after Paystack callback
  verifyPayment: async (data: VerifyPaymentData): Promise<Payment> => {
    return apiService.post<Payment>(API_ENDPOINTS.PAYMENTS.VERIFY, data);
  },

  // Get payment history
  getPaymentHistory: async (): Promise<Payment[]> => {
    return apiService.get<Payment[]>(API_ENDPOINTS.PAYMENTS.HISTORY);
  },
};
