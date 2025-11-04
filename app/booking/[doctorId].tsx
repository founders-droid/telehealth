import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDoctor } from '../../hooks/useDoctors';
import { useCreateAppointment } from '../../hooks/useAppointments';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { APPOINTMENT_DURATIONS } from '../../utils/constants';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function BookingScreen() {
  const { doctorId } = useLocalSearchParams<{ doctorId: string }>();
  const { data: doctor, isLoading: loadingDoctor } = useDoctor(Number(doctorId));
  const createAppointment = useCreateAppointment();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState(30);
  const [reason, setReason] = useState('');

  // Generate next 7 days
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Generate time slots (9 AM to 5 PM)
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor(9 + i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !reason.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    try {
      // Combine date and time
      const [hours, minutes] = selectedTime.split(':');
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const appointmentData = {
        doctor_id: Number(doctorId),
        appointment_date: appointmentDate.toISOString(),
        duration,
        reason: reason.trim(),
        amount: doctor?.consultation_fee || 0,
      };

      // Navigate to payment screen
      router.push({
        pathname: '/booking/payment' as any,
        params: {
          ...appointmentData,
          doctor_name: `Dr. ${doctor?.user?.first_name} ${doctor?.user?.last_name}`,
        },
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to proceed to payment');
    }
  };

  if (loadingDoctor || !doctor) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0073e6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">
            Book Appointment
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Doctor Info */}
        <Card className="p-4 mb-6">
          <View className="flex-row items-center">
            <Avatar
              imageUrl={doctor.user?.profile_photo}
              firstName={doctor.user?.first_name}
              lastName={doctor.user?.last_name}
              size="md"
            />
            <View className="flex-1 ml-4">
              <Text className="text-lg font-semibold text-gray-900">
                Dr. {doctor.user?.first_name} {doctor.user?.last_name}
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                {doctor.specialty}
              </Text>
              <Text className="text-base font-bold text-primary-600 mt-1">
                {formatCurrency(doctor.consultation_fee)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Select Date */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            Select Date
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              {availableDates.map((date, index) => {
                const isSelected =
                  selectedDate?.toDateString() === date.toDateString();
                return (
                  <TouchableOpacity
                    key={index}
                    className={`w-20 py-4 rounded-lg border-2 items-center ${
                      isSelected
                        ? 'bg-primary-600 border-primary-600'
                        : 'bg-white border-gray-300'
                    }`}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Text
                      className={`text-xs font-medium mb-1 ${
                        isSelected ? 'text-white' : 'text-gray-600'
                      }`}
                    >
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </Text>
                    <Text
                      className={`text-2xl font-bold ${
                        isSelected ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {date.getDate()}
                    </Text>
                    <Text
                      className={`text-xs ${
                        isSelected ? 'text-white' : 'text-gray-600'
                      }`}
                    >
                      {date.toLocaleDateString('en-US', { month: 'short' })}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Select Time */}
        {selectedDate && (
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Select Time
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <TouchableOpacity
                    key={time}
                    className={`px-4 py-3 rounded-lg border ${
                      isSelected
                        ? 'bg-primary-600 border-primary-600'
                        : 'bg-white border-gray-300'
                    }`}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        isSelected ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Duration */}
        {selectedTime && (
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Duration
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {APPOINTMENT_DURATIONS.map((option) => {
                const isSelected = duration === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    className={`px-4 py-3 rounded-lg border ${
                      isSelected
                        ? 'bg-primary-600 border-primary-600'
                        : 'bg-white border-gray-300'
                    }`}
                    onPress={() => setDuration(option.value)}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        isSelected ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Reason */}
        {duration && (
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Reason for Visit
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              placeholder="Describe your symptoms or reason for consultation..."
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        )}

        {/* Summary */}
        {selectedDate && selectedTime && reason.trim() && (
          <Card className="p-4 mb-6 bg-primary-50 border-primary-200">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Appointment Summary
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Date</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {formatDate(selectedDate)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Time</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {selectedTime}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Duration</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {duration} minutes
                </Text>
              </View>
              <View className="h-px bg-gray-300 my-2" />
              <View className="flex-row justify-between">
                <Text className="text-base font-semibold text-gray-900">
                  Total
                </Text>
                <Text className="text-base font-bold text-primary-600">
                  {formatCurrency(doctor.consultation_fee)}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Spacing for button */}
        <View className="h-20" />
      </ScrollView>

      {/* Continue Button */}
      {selectedDate && selectedTime && reason.trim() && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
          <Button
            onPress={handleBookAppointment}
            fullWidth
            loading={createAppointment.isPending}
          >
            Continue to Payment
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}
