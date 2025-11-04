import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { DoctorProfile } from '../types';
import { formatCurrency } from '../utils/formatters';
import Card from './ui/Card';
import Avatar from './ui/Avatar';

interface DoctorCardProps {
  doctor: DoctorProfile;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/doctors/${doctor.id}` as any)}
    >
      <Card className="p-4">
        <View className="flex-row">
          <Avatar
            imageUrl={doctor.user?.profile_photo}
            firstName={doctor.user?.first_name}
            lastName={doctor.user?.last_name}
            size="lg"
          />

          <View className="flex-1 ml-4">
            <Text className="text-lg font-bold text-gray-900 mb-1">
              Dr. {doctor.user?.first_name} {doctor.user?.last_name}
            </Text>

            <View className="flex-row items-center mb-2">
              <View className="bg-primary-100 px-3 py-1 rounded-full">
                <Text className="text-xs font-medium text-primary-700">
                  {doctor.specialty}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-2">
              <Text className="text-sm text-gray-600">
                ⭐ {doctor.rating.toFixed(1)} • {doctor.years_experience} years exp
              </Text>
            </View>

            <Text
              className="text-sm text-gray-600 mb-3 leading-5"
              numberOfLines={2}
            >
              {doctor.bio}
            </Text>

            <View className="flex-row items-center justify-between">
              <Text className="text-base font-bold text-primary-600">
                {formatCurrency(doctor.consultation_fee)}
                <Text className="text-sm text-gray-600 font-normal">
                  {' '}
                  / consultation
                </Text>
              </Text>

              <View className="bg-primary-600 px-4 py-2 rounded-lg">
                <Text className="text-white text-sm font-semibold">
                  Book Now
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
