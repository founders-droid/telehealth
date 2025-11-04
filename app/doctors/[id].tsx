import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDoctor } from '../../hooks/useDoctors';
import { formatCurrency } from '../../utils/formatters';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function DoctorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: doctor, isLoading } = useDoctor(Number(id));
  const router = useRouter();

  if (isLoading || !doctor) {
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
          <Text className="text-xl font-bold text-gray-900">Doctor Profile</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Doctor Info */}
        <View className="px-6 py-6 bg-white">
          <View className="items-center">
            <Avatar
              imageUrl={doctor.user?.profile_photo}
              firstName={doctor.user?.first_name}
              lastName={doctor.user?.last_name}
              size="xl"
            />

            <Text className="text-2xl font-bold text-gray-900 mt-4">
              Dr. {doctor.user?.first_name} {doctor.user?.last_name}
            </Text>

            <View className="mt-3 px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-sm font-semibold text-primary-700">
                {doctor.specialty}
              </Text>
            </View>

            <View className="flex-row items-center mt-4 space-x-6">
              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-900">
                  {doctor.rating.toFixed(1)}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">⭐ Rating</Text>
              </View>

              <View className="w-px h-12 bg-gray-300" />

              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-900">
                  {doctor.years_experience}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">Years Exp.</Text>
              </View>

              <View className="w-px h-12 bg-gray-300" />

              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-900">
                  {doctor.total_consultations}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">Patients</Text>
              </View>
            </View>
          </View>
        </View>

        {/* About */}
        <View className="px-6 py-6 mt-2 bg-white">
          <Text className="text-lg font-bold text-gray-900 mb-3">About</Text>
          <Text className="text-base text-gray-700 leading-6">{doctor.bio}</Text>
        </View>

        {/* Professional Details */}
        <View className="px-6 py-6 mt-2 bg-white">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Professional Details
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-center py-2">
              <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
                <Text className="text-lg">🎓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-600">License Number</Text>
                <Text className="text-base font-medium text-gray-900 mt-1">
                  {doctor.license_number}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center py-2">
              <View className="w-10 h-10 bg-secondary-100 rounded-full items-center justify-center mr-3">
                <Text className="text-lg">🏥</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-600">Specialty</Text>
                <Text className="text-base font-medium text-gray-900 mt-1">
                  {doctor.specialty}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center py-2">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Text className="text-lg">💼</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-600">Experience</Text>
                <Text className="text-base font-medium text-gray-900 mt-1">
                  {doctor.years_experience} years in practice
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Consultation Fee */}
        <View className="px-6 py-6 mt-2 bg-white">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-gray-600 mb-1">
                Consultation Fee
              </Text>
              <Text className="text-2xl font-bold text-primary-600">
                {formatCurrency(doctor.consultation_fee)}
              </Text>
            </View>

            <View className="bg-green-100 px-4 py-2 rounded-full">
              <Text className="text-sm font-semibold text-green-700">
                ✓ Available
              </Text>
            </View>
          </View>
        </View>

        {/* Spacing for button */}
        <View className="h-24" />
      </ScrollView>

      {/* Book Appointment Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <Button
          onPress={() =>
            router.push({
              pathname: '/booking/[doctorId]' as any,
              params: { doctorId: doctor.id },
            })
          }
          fullWidth
        >
          Book Appointment
        </Button>
      </View>
    </SafeAreaView>
  );
}
