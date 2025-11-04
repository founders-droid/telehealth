import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';

export default function ProfileScreen() {
  const { user, logout, isPatient, isDoctor } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const menuItems = [
    {
      icon: '👤',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => router.push('/profile/edit' as any),
    },
    ...(isDoctor
      ? [
          {
            icon: '📋',
            title: 'My Profile',
            subtitle: 'View and edit your doctor profile',
            onPress: () => router.push('/profile/doctor' as any),
          },
          {
            icon: '📅',
            title: 'Availability',
            subtitle: 'Manage your schedule',
            onPress: () => router.push('/profile/availability' as any),
          },
        ]
      : []),
    ...(isPatient
      ? [
          {
            icon: '🏥',
            title: 'Medical Records',
            subtitle: 'View and manage your health records',
            onPress: () => router.push('/profile/medical-records' as any),
          },
        ]
      : []),
    {
      icon: '💳',
      title: 'Payment History',
      subtitle: 'View your transaction history',
      onPress: () => router.push('/profile/payments' as any),
    },
    {
      icon: '🔔',
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      onPress: () => router.push('/profile/notifications' as any),
    },
    {
      icon: '❓',
      title: 'Help & Support',
      subtitle: 'Get help or contact support',
      onPress: () => router.push('/profile/support' as any),
    },
    {
      icon: '📄',
      title: 'Terms & Privacy',
      subtitle: 'Read our terms and privacy policy',
      onPress: () => router.push('/profile/terms' as any),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-primary-600 px-6 pt-6 pb-20">
          <Text className="text-2xl font-bold text-white mb-2">Profile</Text>
        </View>

        {/* Profile Card */}
        <View className="px-6 -mt-14">
          <Card className="p-6">
            <View className="items-center">
              <Avatar
                imageUrl={user?.profile_photo}
                firstName={user?.first_name}
                lastName={user?.last_name}
                size="xl"
              />

              <Text className="text-xl font-bold text-gray-900 mt-4">
                {user?.first_name} {user?.last_name}
              </Text>

              <Text className="text-sm text-gray-600 mt-1">{user?.email}</Text>

              <View className="mt-3 px-4 py-2 bg-primary-100 rounded-full">
                <Text className="text-sm font-semibold text-primary-700 capitalize">
                  {user?.role}
                </Text>
              </View>

              {user?.phone && (
                <Text className="text-sm text-gray-600 mt-2">{user.phone}</Text>
              )}
            </View>
          </Card>
        </View>

        {/* Menu Items */}
        <View className="px-6 mt-6 space-y-2">
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} onPress={item.onPress}>
              <Card className="p-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                    <Text className="text-xl">{item.icon}</Text>
                  </View>

                  <View className="flex-1 ml-4">
                    <Text className="text-base font-semibold text-gray-900">
                      {item.title}
                    </Text>
                    <Text className="text-sm text-gray-600 mt-0.5">
                      {item.subtitle}
                    </Text>
                  </View>

                  <Text className="text-gray-400 text-xl">›</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View className="px-6 mt-6 mb-8">
          <TouchableOpacity
            className="bg-red-50 border border-red-200 rounded-lg py-4 items-center"
            onPress={handleLogout}
          >
            <Text className="text-red-600 font-semibold text-base">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View className="items-center pb-6">
          <Text className="text-sm text-gray-400">Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
