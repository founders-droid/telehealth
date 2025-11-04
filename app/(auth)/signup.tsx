import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import {
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  getPasswordStrength,
} from '../../utils/validators';
import { UserRole } from '../../types';

export default function SignupScreen() {
  const { role } = useLocalSearchParams<{ role: UserRole }>();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signup, isLoading } = useAuth();
  const router = useRouter();

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhoneNumber(formData.phone)) {
      newErrors.phone = 'Please enter a valid Nigerian phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters with letters and numbers';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await signup({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.trim(),
        role: role || 'patient',
      });

      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Unable to create account');
    }
  };

  const passwordStrength = formData.password
    ? getPasswordStrength(formData.password)
    : null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="px-6 py-8"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </Text>
            <Text className="text-base text-gray-600">
              Sign up as a {role === 'doctor' ? 'Doctor' : 'Patient'}
            </Text>
          </View>

          {/* First Name */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              First Name
            </Text>
            <TextInput
              className={`border ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              } rounded-lg px-4 py-3 text-base`}
              placeholder="Enter your first name"
              value={formData.firstName}
              onChangeText={(text) => updateField('firstName', text)}
              autoCapitalize="words"
              editable={!isLoading}
            />
            {errors.firstName && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.firstName}
              </Text>
            )}
          </View>

          {/* Last Name */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Last Name
            </Text>
            <TextInput
              className={`border ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              } rounded-lg px-4 py-3 text-base`}
              placeholder="Enter your last name"
              value={formData.lastName}
              onChangeText={(text) => updateField('lastName', text)}
              autoCapitalize="words"
              editable={!isLoading}
            />
            {errors.lastName && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.lastName}
              </Text>
            )}
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Email Address
            </Text>
            <TextInput
              className={`border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-lg px-4 py-3 text-base`}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading}
            />
            {errors.email && (
              <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
            )}
          </View>

          {/* Phone */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </Text>
            <TextInput
              className={`border ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } rounded-lg px-4 py-3 text-base`}
              placeholder="0803 123 4567"
              value={formData.phone}
              onChangeText={(text) => updateField('phone', text)}
              keyboardType="phone-pad"
              editable={!isLoading}
            />
            {errors.phone && (
              <Text className="text-red-500 text-sm mt-1">{errors.phone}</Text>
            )}
          </View>

          {/* Password */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Password
            </Text>
            <View className="relative">
              <TextInput
                className={`border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg px-4 py-3 text-base pr-12`}
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(text) => updateField('password', text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!isLoading}
              />
              <TouchableOpacity
                className="absolute right-3 top-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text className="text-primary-600 text-sm font-medium">
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            {passwordStrength && (
              <View className="flex-row items-center mt-2">
                <View className="flex-1 flex-row space-x-1">
                  <View
                    className={`flex-1 h-2 rounded ${
                      passwordStrength === 'weak'
                        ? 'bg-red-500'
                        : passwordStrength === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                  <View
                    className={`flex-1 h-2 rounded ${
                      passwordStrength === 'medium' || passwordStrength === 'strong'
                        ? passwordStrength === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                  <View
                    className={`flex-1 h-2 rounded ${
                      passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                </View>
                <Text className="text-xs text-gray-600 ml-2 capitalize">
                  {passwordStrength}
                </Text>
              </View>
            )}
            {errors.password && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.password}
              </Text>
            )}
          </View>

          {/* Confirm Password */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </Text>
            <TextInput
              className={`border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-lg px-4 py-3 text-base`}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(text) => updateField('confirmPassword', text)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!isLoading}
            />
            {errors.confirmPassword && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </Text>
            )}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            className={`bg-primary-600 rounded-lg py-4 items-center mb-6 ${
              isLoading ? 'opacity-50' : ''
            }`}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-base font-semibold">
                Create Account
              </Text>
            )}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
