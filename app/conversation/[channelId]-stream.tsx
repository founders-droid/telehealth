import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Channel, MessageList, MessageInput, Thread } from 'stream-chat-expo';
import { useStreamChat } from '../../contexts/StreamChatContext';
import { Channel as ChannelType } from 'stream-chat';

export default function ConversationScreen() {
  const { channelId, channelType = 'messaging' } = useLocalSearchParams<{
    channelId: string;
    channelType?: string;
  }>();
  const { client } = useStreamChat();
  const router = useRouter();
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!client || !channelId) return;

    const initChannel = async () => {
      try {
        const ch = client.channel(channelType, channelId);
        await ch.watch();
        setChannel(ch);
      } catch (error) {
        console.error('Error loading channel:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initChannel();
  }, [client, channelId, channelType]);

  if (isLoading || !channel) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0073e6" />
        </View>
      </SafeAreaView>
    );
  }

  const otherMembers = Object.values(channel.state.members).filter(
    (member) => member.user_id !== client?.userID
  );
  const otherUser = otherMembers[0]?.user;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Channel channel={channel}>
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-gray-200">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Text className="text-2xl">←</Text>
            </TouchableOpacity>

            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                {otherUser?.name || 'User'}
              </Text>
              {otherUser?.online && (
                <View className="flex-row items-center mt-1">
                  <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  <Text className="text-xs text-gray-600">Online</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Messages */}
        <MessageList />

        {/* Input */}
        <MessageInput />

        {/* Thread for replies */}
        <Thread />
      </Channel>
    </SafeAreaView>
  );
}
