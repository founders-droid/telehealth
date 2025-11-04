import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useConversations, useUnreadCount } from '../../hooks/useMessages';
import { useRealtime } from '../../hooks/useRealtime';
import { formatRelativeTime } from '../../utils/formatters';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';

export default function MessagesScreen() {
  const router = useRouter();
  const { data: conversations, isLoading, refetch } = useConversations();
  const unreadCount = useUnreadCount();
  const { isConnected } = useRealtime();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Messages</Text>
            {unreadCount > 0 && (
              <Text className="text-sm text-gray-600 mt-1">
                {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
              </Text>
            )}
          </View>

          {/* Realtime Connection Status */}
          <View className="flex-row items-center">
            <View
              className={`w-2 h-2 rounded-full mr-2 ${
                isConnected ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
            <Text className="text-xs text-gray-600">
              {isConnected ? 'Live' : 'Connecting...'}
            </Text>
          </View>
        </View>
      </View>

      {/* Conversations List */}
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
        {isLoading && !conversations ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#0073e6" />
          </View>
        ) : conversations && conversations.length > 0 ? (
          <View className="px-6 py-4 space-y-2">
            {conversations.map((conversation) => (
              <TouchableOpacity
                key={conversation.user.id}
                onPress={() =>
                  router.push({
                    pathname: '/conversation/[userId]' as any,
                    params: {
                      userId: conversation.user.id,
                      userName: `${conversation.user.first_name} ${conversation.user.last_name}`,
                      userPhoto: conversation.user.profile_photo,
                    },
                  })
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
