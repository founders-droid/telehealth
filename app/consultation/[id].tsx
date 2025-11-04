import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Call,
  StreamCall,
  CallContent,
  CallTopView,
  CallControls,
} from '@stream-io/video-react-native-sdk';
import { useStreamVideo } from '../../contexts/StreamVideoContext';
import { useAppointment } from '../../hooks/useAppointments';
import { getCallId } from '../../config/stream';
import { useAuth } from '../../hooks/useAuth';

export default function ConsultationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { client, isConnected } = useStreamVideo();
  const { data: appointment, isLoading: loadingAppointment } = useAppointment(
    Number(id)
  );
  const { user, isDoctor } = useAuth();
  const router = useRouter();

  const [call, setCall] = useState<Call | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (!client || !appointment || !isConnected) return;

    const initCall = async () => {
      try {
        setIsJoining(true);

        const callId = getCallId(appointment.id);
        const newCall = client.call('default', callId);

        // Create or join the call
        await newCall.join({
          create: true,
        });

        setCall(newCall);
      } catch (error) {
        console.error('Error joining call:', error);
        Alert.alert('Error', 'Failed to join the video consultation');
      } finally {
        setIsJoining(false);
      }
    };

    initCall();

    // Cleanup: leave call when component unmounts
    return () => {
      if (call) {
        call.leave();
      }
    };
  }, [client, appointment, isConnected]);

  if (loadingAppointment || !appointment) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">Loading appointment...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isConnected || isJoining) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">
            {!isConnected ? 'Connecting...' : 'Joining call...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!call) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-6xl mb-4">📹</Text>
          <Text className="text-white text-lg font-semibold mb-2 text-center">
            Unable to Join Call
          </Text>
          <Text className="text-gray-400 text-center mb-6">
            There was a problem joining the video consultation.
          </Text>
          <TouchableOpacity
            className="bg-primary-600 rounded-lg px-6 py-3"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const otherUser = isDoctor ? appointment.patient : appointment.doctor;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StreamCall call={call}>
        {/* Custom Top Bar */}
        <View className="absolute top-0 left-0 right-0 z-10 bg-black/50 px-6 py-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-lg font-semibold">
                {isDoctor ? 'Consultation with' : 'Dr.'}  {otherUser?.first_name}{' '}
                {otherUser?.last_name}
              </Text>
              <Text className="text-gray-300 text-sm mt-1">
                Video Consultation
              </Text>
            </View>
          </View>
        </View>

        {/* Video Call Content */}
        <CallContent />

        {/* Call Controls */}
        <CallControls
          onHangupCallHandler={() => {
            call.leave();
            router.back();
          }}
        />
      </StreamCall>
    </SafeAreaView>
  );
}
