import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { formatRelativeTime } from '../../utils/formatters';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';

export default function MessagesScreen() {
  const router = useRouter();

  // Mock data for now - will be replaced with actual API call
  const conversations = [
    {
      id: 1,
      user: {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        profile_photo: '',
      },
      last_message: {
        message_text: 'Thank you for the consultation!',
        created_at: new Date().toISOString(),
        is_read: true,
      },
      unread_count: 0,
    },
    {
      id: 2,
      user: {
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        profile_photo: '',
      },
      last_message: {
        message_text: 'Can we reschedule our appointment?',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        is_read: false,
      },
      unread_count: 2,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Messages</Text>
      </View>

      {/* Conversations List */}
      <ScrollView className="flex-1">
        {conversations.length > 0 ? (
          <View className="px-6 py-4 space-y-2">
            {conversations.map((conversation) => (
              <TouchableOpacity
                key={conversation.id}
                onPress={() =>
                  router.push(`/conversation/${conversation.user.id}` as any)
                }
              >
                <Card className="p-4">
                  <View className="flex-row items-center">
                    <Avatar
                      imageUrl={conversation.user.profile_photo}
                      firstName={conversation.user.first_name}
                      lastName={conversation.user.last_name}
                      size="md"
                    />

                    <View className="flex-1 ml-4">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-base font-semibold text-gray-900">
                          {conversation.user.first_name}{' '}
                          {conversation.user.last_name}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {formatRelativeTime(conversation.last_message.created_at)}
                        </Text>
                      </View>

                      <View className="flex-row items-center justify-between">
                        <Text
                          className={`text-sm flex-1 ${
                            conversation.unread_count > 0
                              ? 'text-gray-900 font-medium'
                              : 'text-gray-600'
                          }`}
                          numberOfLines={1}
                        >
                          {conversation.last_message.message_text}
                        </Text>

                        {conversation.unread_count > 0 && (
                          <View className="ml-2 w-6 h-6 bg-primary-600 rounded-full items-center justify-center">
                            <Text className="text-white text-xs font-bold">
                              {conversation.unread_count}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-6xl mb-4">💬</Text>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              No messages yet
            </Text>
            <Text className="text-base text-gray-600 text-center px-8">
              Your conversations with doctors and patients will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
