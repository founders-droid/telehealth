import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useConversation, useSendMessage, useMarkMessageAsRead } from '../../hooks/useMessages';
import { formatTime } from '../../utils/formatters';
import Avatar from '../../components/ui/Avatar';

export default function ConversationScreen() {
  const { userId, userName, userPhoto } = useLocalSearchParams<{
    userId: string;
    userName?: string;
    userPhoto?: string;
  }>();
  const { user } = useAuth();
  const { messages, isLoading } = useConversation(Number(userId));
  const sendMessage = useSendMessage();
  const markAsRead = useMarkMessageAsRead();
  const router = useRouter();

  const [messageText, setMessageText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollViewRef.current?.scrollToEnd({ animated: true });

      // Mark messages as read
      const unreadMessages = messages.filter(
        (m) => !m.is_read && m.sender_id !== user?.id
      );

      unreadMessages.forEach((message) => {
        markAsRead.mutate(message.id);
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim()) return;

    try {
      await sendMessage.mutateAsync({
        receiver_id: Number(userId),
        message_text: messageText.trim(),
      });

      setMessageText('');
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const renderMessage = (message: any, index: number) => {
    const isOwnMessage = message.sender_id === user?.id;
    const showAvatar =
      index === 0 ||
      messages[index - 1]?.sender_id !== message.sender_id;

    return (
      <View
        key={message.id}
        className={`flex-row mb-3 ${
          isOwnMessage ? 'justify-end' : 'justify-start'
        }`}
      >
        {!isOwnMessage && showAvatar && (
          <Avatar
            imageUrl={userPhoto}
            firstName={userName?.split(' ')[0] || 'U'}
            lastName={userName?.split(' ')[1] || 'N'}
            size="sm"
            className="mr-2"
          />
        )}

        {!isOwnMessage && !showAvatar && <View className="w-8 mr-2" />}

        <View
          className={`max-w-[75%] ${
            isOwnMessage ? 'items-end' : 'items-start'
          }`}
        >
          <View
            className={`rounded-2xl px-4 py-3 ${
              isOwnMessage
                ? 'bg-primary-600 rounded-tr-sm'
                : 'bg-gray-200 rounded-tl-sm'
            }`}
          >
            <Text
              className={`text-base ${
                isOwnMessage ? 'text-white' : 'text-gray-900'
              }`}
            >
              {message.message_text}
            </Text>
          </View>

          <View className="flex-row items-center mt-1 px-1">
            <Text className="text-xs text-gray-500">
              {formatTime(message.created_at)}
            </Text>
            {isOwnMessage && (
              <Text className="text-xs text-gray-500 ml-1">
                {message.is_read ? '✓✓' : '✓'}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>

          <Avatar
            imageUrl={userPhoto}
            firstName={userName?.split(' ')[0] || 'U'}
            lastName={userName?.split(' ')[1] || 'N'}
            size="sm"
            className="mr-3"
          />

          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">
              {userName || 'User'}
            </Text>
            <View className="flex-row items-center mt-1">
              <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              <Text className="text-xs text-gray-600">Online</Text>
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-6 py-4"
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#0073e6" />
            </View>
          ) : messages.length > 0 ? (
            <View>{messages.map((message, index) => renderMessage(message, index))}</View>
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-6xl mb-4">💬</Text>
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                No messages yet
              </Text>
              <Text className="text-base text-gray-600 text-center px-8">
                Start the conversation by sending a message
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View className="px-6 py-4 bg-white border-t border-gray-200">
          <View className="flex-row items-center">
            <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2 mr-2">
              <TextInput
                className="flex-1 text-base py-2"
                placeholder="Type a message..."
                value={messageText}
                onChangeText={setMessageText}
                multiline
                maxLength={1000}
                editable={!sendMessage.isPending}
              />

              {messageText.length > 0 && (
                <Text className="text-xs text-gray-500 ml-2">
                  {messageText.length}/1000
                </Text>
              )}
            </View>

            <TouchableOpacity
              className={`w-12 h-12 rounded-full items-center justify-center ${
                messageText.trim() && !sendMessage.isPending
                  ? 'bg-primary-600'
                  : 'bg-gray-300'
              }`}
              onPress={handleSend}
              disabled={!messageText.trim() || sendMessage.isPending}
            >
              {sendMessage.isPending ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-xl">➤</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
