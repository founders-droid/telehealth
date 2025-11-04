import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useAppointments } from '../../hooks/useAppointments';
import { formatDate, formatTime, formatCurrency } from '../../utils/formatters';
import { AppointmentStatus } from '../../types';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';

export default function AppointmentsScreen() {
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');
  const { user, isPatient, isDoctor } = useAuth();
  const { data: appointments, isLoading, refetch } = useAppointments();
  const router = useRouter();

  const upcomingAppointments = appointments?.filter(
    (apt) =>
      apt.status === 'pending' ||
      apt.status === 'confirmed' ||
      new Date(apt.appointment_date) > new Date()
  );

  const pastAppointments = appointments?.filter(
    (apt) =>
      apt.status === 'completed' ||
      apt.status === 'cancelled' ||
      (new Date(apt.appointment_date) < new Date() && apt.status !== 'pending')
  );

  const displayedAppointments =
    selectedTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Appointments</Text>
      </View>

      {/* Tabs */}
      <View className="bg-white px-6 py-3 flex-row space-x-4 border-b border-gray-200">
        <TouchableOpacity
          className={`pb-2 ${
            selectedTab === 'upcoming' ? 'border-b-2 border-primary-600' : ''
          }`}
          onPress={() => setSelectedTab('upcoming')}
        >
          <Text
            className={`text-base font-semibold ${
              selectedTab === 'upcoming' ? 'text-primary-600' : 'text-gray-500'
            }`}
          >
            Upcoming ({upcomingAppointments?.length || 0})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`pb-2 ${
            selectedTab === 'past' ? 'border-b-2 border-primary-600' : ''
          }`}
          onPress={() => setSelectedTab('past')}
        >
          <Text
            className={`text-base font-semibold ${
              selectedTab === 'past' ? 'text-primary-600' : 'text-gray-500'
            }`}
          >
            Past ({pastAppointments?.length || 0})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-6 py-4"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => refetch()}
            tintColor="#0073e6"
          />
        }
      >
        {isLoading && !appointments ? (
          <View className="py-20 items-center">
            <ActivityIndicator size="large" color="#0073e6" />
          </View>
        ) : displayedAppointments && displayedAppointments.length > 0 ? (
          <View className="space-y-4">
            {displayedAppointments.map((appointment) => {
              const otherUser = isPatient ? appointment.doctor : appointment.patient;
              return (
                <TouchableOpacity
                  key={appointment.id}
                  onPress={() =>
                    router.push(`/appointment/${appointment.id}` as any)
                  }
                >
                  <Card className="p-4">
                    <View className="flex-row items-start">
                      <Avatar
                        imageUrl={otherUser?.profile_photo}
                        firstName={otherUser?.first_name}
                        lastName={otherUser?.last_name}
                        size="lg"
                      />

                      <View className="flex-1 ml-4">
                        <View className="flex-row items-center justify-between mb-2">
                          <Text className="text-lg font-semibold text-gray-900">
                            {isPatient ? 'Dr. ' : ''}
                            {otherUser?.first_name} {otherUser?.last_name}
                          </Text>
                          <View
                            className={`px-3 py-1 rounded-full ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            <Text className="text-xs font-medium capitalize">
                              {appointment.status}
                            </Text>
                          </View>
                        </View>

                        <Text className="text-sm text-gray-600 mb-3">
                          {appointment.reason}
                        </Text>

                        <View className="flex-row items-center mb-2">
                          <Text className="text-sm text-gray-600">
                            📅 {formatDate(appointment.appointment_date)}
                          </Text>
                        </View>

                        <View className="flex-row items-center justify-between">
                          <Text className="text-sm text-gray-600">
                            🕐 {formatTime(appointment.appointment_date)} •{' '}
                            {appointment.duration} min
                          </Text>
                          <Text className="text-sm font-semibold text-primary-600">
                            {formatCurrency(appointment.amount)}
                          </Text>
                        </View>

                        {selectedTab === 'upcoming' &&
                          appointment.status === 'confirmed' && (
                            <TouchableOpacity
                              className="mt-3 bg-primary-600 rounded-lg py-2 items-center"
                              onPress={() =>
                                router.push(`/consultation/${appointment.id}` as any)
                              }
                            >
                              <Text className="text-white font-semibold">
                                Join Consultation
                              </Text>
                            </TouchableOpacity>
                          )}
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View className="py-20 items-center">
            <Text className="text-6xl mb-4">📅</Text>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              No {selectedTab} appointments
            </Text>
            <Text className="text-base text-gray-600 text-center mb-6">
              {selectedTab === 'upcoming'
                ? isPatient
                  ? "You don't have any upcoming appointments."
                  : 'You have no upcoming consultations scheduled.'
                : 'No past appointments to show.'}
            </Text>
            {isPatient && selectedTab === 'upcoming' && (
              <TouchableOpacity
                className="bg-primary-600 rounded-lg px-6 py-3"
                onPress={() => router.push('/doctors')}
              >
                <Text className="text-white font-semibold">
                  Book an Appointment
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
