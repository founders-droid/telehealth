import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Channel as ChannelType } from 'stream-chat';
import { ChannelList } from 'stream-chat-expo';
import { useStreamChat } from '../../contexts/StreamChatContext';

export default function MessagesScreen() {
  const router = useRouter();
  const { client, isConnecting, isConnected } = useStreamChat();

  const filters = {
    type: 'messaging',
    members: { $in: [client?.userID || ''] },
  };

  const sort = { last_message_at: -1 as const };

  const onSelectChannel = (channel: ChannelType) => {
    router.push({
      pathname: '/conversation/[channelId]' as any,
      params: {
        channelId: channel.id,
        channelType: channel.type,
      },
    });
  };

  if (isConnecting || !client) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0073e6" />
          <Text className="text-gray-600 mt-4">Connecting to chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">Messages</Text>

          {/* Connection Status */}
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

      {/* Channel List */}
      <ChannelList
        filters={filters}
        sort={sort}
        onSelect={onSelectChannel}
        EmptyStateIndicator={() => (
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
      />
    </SafeAreaView>
  );
}
