import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../../services/auth';
import { isValidEmail } from '../../utils/validators';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    try {
      setIsLoading(true);
      await authService.forgotPassword(email.toLowerCase().trim());

      Alert.alert(
        'Email Sent',
        'Password reset instructions have been sent to your email.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <View className="flex-1 justify-center">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </Text>
          <Text className="text-base text-gray-600 leading-6">
            Enter your email address and we'll send you instructions to reset
            your password.
          </Text>
        </View>

        {/* Email Input */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Email Address
          </Text>
          <TextInput
            className={`border ${
              error ? 'border-red-500' : 'border-gray-300'
            } rounded-lg px-4 py-3 text-base`}
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!isLoading}
          />
          {error && (
            <Text className="text-red-500 text-sm mt-1">{error}</Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className={`bg-primary-600 rounded-lg py-4 items-center mb-6 ${
            isLoading ? 'opacity-50' : ''
          }`}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-base font-semibold">
              Send Reset Link
            </Text>
          )}
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity
          className="items-center"
          onPress={() => router.back()}
        >
          <Text className="text-primary-600 text-base font-semibold">
            Back to Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
