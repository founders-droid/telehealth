import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDoctors } from '../../hooks/useDoctors';
import { MEDICAL_SPECIALTIES } from '../../utils/constants';
import DoctorCard from '../../components/DoctorCard';

export default function DoctorsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | undefined>();
  const router = useRouter();

  const { data: doctors, isLoading, refetch } = useDoctors({
    specialty: selectedSpecialty,
    search: searchQuery,
  });

  const filteredDoctors = doctors?.filter((doctor) => {
    const matchesSearch = searchQuery
      ? `${doctor.user?.first_name} ${doctor.user?.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesSpecialty = selectedSpecialty
      ? doctor.specialty === selectedSpecialty
      : true;

    return matchesSearch && matchesSpecialty;
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">Find a Doctor</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => refetch()}
            tintColor="#0073e6"
          />
        }
      >
        {/* Search Bar */}
        <View className="px-6 py-4 bg-white">
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <Text className="text-xl mr-2">🔍</Text>
            <TextInput
              className="flex-1 text-base"
              placeholder="Search by name or specialty"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text className="text-gray-400 text-lg">✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Specialty Filter */}
        <View className="px-6 py-4 bg-white border-t border-gray-200">
          <Text className="text-sm font-semibold text-gray-700 mb-3">
            Filter by Specialty
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                className={`px-4 py-2 rounded-full border ${
                  !selectedSpecialty
                    ? 'bg-primary-600 border-primary-600'
                    : 'bg-white border-gray-300'
                }`}
                onPress={() => setSelectedSpecialty(undefined)}
              >
                <Text
                  className={`text-sm font-medium ${
                    !selectedSpecialty ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  All
                </Text>
              </TouchableOpacity>

              {MEDICAL_SPECIALTIES.slice(0, 10).map((specialty) => (
                <TouchableOpacity
                  key={specialty}
                  className={`px-4 py-2 rounded-full border ${
                    selectedSpecialty === specialty
                      ? 'bg-primary-600 border-primary-600'
                      : 'bg-white border-gray-300'
                  }`}
                  onPress={() =>
                    setSelectedSpecialty(
                      selectedSpecialty === specialty ? undefined : specialty
                    )
                  }
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedSpecialty === specialty
                        ? 'text-white'
                        : 'text-gray-700'
                    }`}
                  >
                    {specialty}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Results */}
        <View className="px-6 py-4">
          {isLoading && !doctors ? (
            <View className="py-20 items-center">
              <ActivityIndicator size="large" color="#0073e6" />
            </View>
          ) : filteredDoctors && filteredDoctors.length > 0 ? (
            <View>
              <Text className="text-sm text-gray-600 mb-4">
                {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}{' '}
                found
              </Text>

              <View className="space-y-4">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </View>
            </View>
          ) : (
            <View className="py-20 items-center">
              <Text className="text-6xl mb-4">🔍</Text>
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                No doctors found
              </Text>
              <Text className="text-base text-gray-600 text-center px-8">
                {searchQuery || selectedSpecialty
                  ? 'Try adjusting your search or filters'
                  : 'No doctors available at the moment'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
