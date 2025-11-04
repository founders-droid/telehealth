import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useCreateAppointment } from '../../hooks/useAppointments';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function PaymentScreen() {
  const params = useLocalSearchParams<{
    doctor_id: string;
    doctor_name: string;
    appointment_date: string;
    duration: string;
    reason: string;
    amount: string;
  }>();

  const [isProcessing, setIsProcessing] = useState(false);
  const createAppointment = useCreateAppointment();
  const router = useRouter();

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // In a real implementation, this would:
      // 1. Initialize Paystack payment
      // 2. Open Paystack WebView
      // 3. Wait for payment completion
      // 4. Verify payment on backend
      // 5. Create appointment after successful payment

      // For now, simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create appointment
      await createAppointment.mutateAsync({
        doctor_id: Number(params.doctor_id),
        appointment_date: params.appointment_date,
        duration: Number(params.duration),
        reason: params.reason,
        amount: Number(params.amount),
      });

      Alert.alert(
        'Success!',
        'Your appointment has been booked successfully. You will receive a confirmation email shortly.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/appointments'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Payment Failed', error.message || 'Unable to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4"
            disabled={isProcessing}
          >
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Payment</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Appointment Details */}
        <Card className="p-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Appointment Details
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-gray-600">Doctor</Text>
              <Text className="text-sm font-medium text-gray-900 text-right">
                {params.doctor_name}
              </Text>
            </View>

            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-gray-600">Date & Time</Text>
              <Text className="text-sm font-medium text-gray-900 text-right">
                {formatDate(new Date(params.appointment_date))}
                {'\n'}
                {new Date(params.appointment_date).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>

            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-gray-600">Duration</Text>
              <Text className="text-sm font-medium text-gray-900">
                {params.duration} minutes
              </Text>
            </View>

            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-gray-600">Reason</Text>
              <Text className="text-sm font-medium text-gray-900 text-right flex-1 ml-4">
                {params.reason}
              </Text>
            </View>
          </View>
        </Card>

        {/* Payment Summary */}
        <Card className="p-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Payment Summary
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-gray-600">Consultation Fee</Text>
              <Text className="text-sm font-medium text-gray-900">
                {formatCurrency(Number(params.amount))}
              </Text>
            </View>

            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-gray-600">Service Fee</Text>
              <Text className="text-sm font-medium text-gray-900">
                {formatCurrency(0)}
              </Text>
            </View>

            <View className="h-px bg-gray-300 my-2" />

            <View className="flex-row justify-between py-2">
              <Text className="text-base font-bold text-gray-900">
                Total Amount
              </Text>
              <Text className="text-xl font-bold text-primary-600">
                {formatCurrency(Number(params.amount))}
              </Text>
            </View>
          </View>
        </Card>

        {/* Payment Methods */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            Payment Method
          </Text>

          <Card className="p-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-primary-100 rounded-lg items-center justify-center mr-4">
                <Text className="text-2xl">💳</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">
                  Paystack
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  Card, Bank Transfer, USSD
                </Text>
              </View>
              <View className="w-6 h-6 bg-primary-600 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Security Notice */}
        <View className="bg-blue-50 rounded-lg p-4 mb-6">
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">🔒</Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900 mb-1">
                Secure Payment
              </Text>
              <Text className="text-sm text-gray-600 leading-5">
                Your payment information is encrypted and secure. We never store
                your card details.
              </Text>
            </View>
          </View>
        </View>

        {/* Spacing for button */}
        <View className="h-20" />
      </ScrollView>

      {/* Pay Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <Button
          onPress={handlePayment}
          fullWidth
          loading={isProcessing}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay ${formatCurrency(Number(params.amount))}`}
        </Button>
      </View>
    </SafeAreaView>
  );
}
