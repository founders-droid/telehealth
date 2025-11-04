export type PaymentMethod = 'card' | 'bank_transfer' | 'ussd' | 'mobile_money';
export type PaymentStatusType = 'pending' | 'success' | 'failed';

export interface Payment {
  id: number;
  appointment_id: number;
  patient_id: number;
  amount: number;
  paystack_reference: string;
  status: PaymentStatusType;
  payment_method?: PaymentMethod;
  created_at: string;
}

export interface InitializePaymentData {
  amount: number;
  email: string;
  appointment_id: number;
}

export interface InitializePaymentResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface VerifyPaymentData {
  reference: string;
}

export interface PaystackWebViewProps {
  paystackKey: string;
  amount: number;
  billingEmail: string;
  billingName: string;
  reference: string;
  onCancel: () => void;
  onSuccess: (reference: string) => void;
}
