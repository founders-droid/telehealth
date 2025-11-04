import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useUpcomingAppointments } from '../../hooks/useAppointments';
import { formatDate, formatTime } from '../../utils/formatters';

export default function HomeScreen() {
  const { user, isPatient, isDoctor } = useAuth();
  const { data: appointments, isLoading } = useUpcomingAppointments();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-primary-600 px-6 py-8 pb-12">
          <Text className="text-white text-2xl font-bold mb-1">
            Welcome back, {user?.first_name}!
          </Text>
          <Text className="text-primary-100 text-base">
            {isPatient
              ? 'How can we help you today?'
              : 'Ready to help your patients?'}
          </Text>
        </View>

        <View className="px-6 -mt-6">
          {/* Quick Actions */}
          <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </Text>

            {isPatient && (
              <View className="space-y-3">
                <TouchableOpacity
                  className="bg-primary-50 rounded-lg p-4 flex-row items-center"
                  onPress={() => router.push('/doctors')}
                >
                  <View className="w-10 h-10 bg-primary-600 rounded-full items-center justify-center mr-3">
                    <Text className="text-white text-xl">🔍</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900">
                      Find a Doctor
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Browse and book appointments
                    </Text>
                  </View>
                  <Text className="text-primary-600 text-xl">→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-secondary-50 rounded-lg p-4 flex-row items-center"
                  onPress={() => router.push('/(tabs)/appointments')}
                >
                  <View className="w-10 h-10 bg-secondary-600 rounded-full items-center justify-center mr-3">
                    <Text className="text-white text-xl">📅</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900">
                      My Appointments
                    </Text>
                    <Text className="text-sm text-gray-600">
                      View your scheduled consultations
                    </Text>
                  </View>
                  <Text className="text-secondary-600 text-xl">→</Text>
                </TouchableOpacity>
              </View>
            )}

            {isDoctor && (
              <View className="space-y-3">
                <TouchableOpacity
                  className="bg-primary-50 rounded-lg p-4 flex-row items-center"
                  onPress={() => router.push('/(tabs)/appointments')}
                >
                  <View className="w-10 h-10 bg-primary-600 rounded-full items-center justify-center mr-3">
                    <Text className="text-white text-xl">📋</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900">
                      My Schedule
                    </Text>
                    <Text className="text-sm text-gray-600">
                      View upcoming consultations
                    </Text>
                  </View>
                  <Text className="text-primary-600 text-xl">→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-secondary-50 rounded-lg p-4 flex-row items-center"
                  onPress={() => router.push('/(tabs)/messages')}
                >
                  <View className="w-10 h-10 bg-secondary-600 rounded-full items-center justify-center mr-3">
                    <Text className="text-white text-xl">💬</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900">
                      Messages
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Chat with patients
                    </Text>
                  </View>
                  <Text className="text-secondary-600 text-xl">→</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Upcoming Appointments */}
          <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-900">
                Upcoming Appointments
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/appointments')}
              >
                <Text className="text-primary-600 text-sm font-medium">
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View className="py-8 items-center">
                <ActivityIndicator size="large" color="#0073e6" />
              </View>
            ) : appointments && appointments.length > 0 ? (
              <View className="space-y-3">
                {appointments.slice(0, 3).map((appointment) => (
                  <View
                    key={appointment.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900">
                          {isPatient
                            ? `Dr. ${appointment.doctor?.first_name} ${appointment.doctor?.last_name}`
                            : `${appointment.patient?.first_name} ${appointment.patient?.last_name}`}
                        </Text>
                        <Text className="text-sm text-gray-600 mt-1">
                          {appointment.reason}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-sm text-gray-600">
                        📅 {formatDate(appointment.appointment_date)}
                      </Text>
                      <Text className="text-gray-400 mx-2">•</Text>
                      <Text className="text-sm text-gray-600">
                        🕐 {formatTime(appointment.appointment_date)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="py-8 items-center">
                <Text className="text-gray-500 text-base">
                  No upcoming appointments
                </Text>
                {isPatient && (
                  <TouchableOpacity
                    className="mt-4"
                    onPress={() => router.push('/doctors')}
                  >
                    <Text className="text-primary-600 font-medium">
                      Book an Appointment
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Health Tips (for patients) */}
          {isPatient && (
            <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Health Tips
              </Text>
              <View className="bg-blue-50 rounded-lg p-4">
                <Text className="text-base font-medium text-gray-900 mb-2">
                  Stay Hydrated
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  Drink at least 8 glasses of water daily to maintain optimal
                  health and body function.
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
