import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleRoleSelect = (role: 'patient' | 'doctor') => {
    router.push({
      pathname: '/(auth)/signup',
      params: { role },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <View className="flex-1 justify-center">
        {/* Header */}
        <View className="mb-12">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Join Telehealth
          </Text>
          <Text className="text-base text-gray-600">
            Choose how you want to use our platform
          </Text>
        </View>

        {/* Patient Card */}
        <TouchableOpacity
          className="bg-white border-2 border-primary-600 rounded-xl p-6 mb-4"
          onPress={() => handleRoleSelect('patient')}
        >
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-4">
              <Text className="text-2xl">👤</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900">
              I'm a Patient
            </Text>
          </View>
          <Text className="text-gray-600 leading-6">
            Book appointments, consult with verified doctors, and manage your
            health records securely.
          </Text>
        </TouchableOpacity>

        {/* Doctor Card */}
        <TouchableOpacity
          className="bg-white border-2 border-secondary-600 rounded-xl p-6 mb-8"
          onPress={() => handleRoleSelect('doctor')}
        >
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 bg-secondary-100 rounded-full items-center justify-center mr-4">
              <Text className="text-2xl">👨‍⚕️</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900">
              I'm a Doctor
            </Text>
          </View>
          <Text className="text-gray-600 leading-6">
            Provide remote consultations, manage appointments, and help patients
            from anywhere.
          </Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity
          className="items-center"
          onPress={() => router.back()}
        >
          <Text className="text-gray-600 text-base">
            Already have an account?{' '}
            <Text className="text-primary-600 font-semibold">Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
