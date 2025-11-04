import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesService } from '../services/messages';
import { Message, SendMessageData } from '../types';
import { useRealtimeSubscription } from './useRealtime';
import { useAuth } from './useAuth';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagesService.getConversations(),
  });
};

export const useConversation = (userId: number) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch initial messages
  const { data: initialMessages, isLoading } = useQuery({
    queryKey: ['conversation', userId],
    queryFn: () => messagesService.getConversation(userId),
    enabled: !!userId,
  });

  // Set initial messages
  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // Subscribe to new messages in this conversation
  useRealtimeSubscription(
    `conversation_${userId}`,
    'new_message',
    useCallback((newMessage: Message) => {
      setMessages((prev) => {
        // Check if message already exists (avoid duplicates)
        if (prev.some((m) => m.id === newMessage.id)) {
          return prev;
        }
        return [...prev, newMessage];
      });

      // Invalidate conversations list to update last message
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }, [queryClient])
  );

  // Subscribe to message read events
  useRealtimeSubscription(
    `conversation_${userId}`,
    'message_read',
    useCallback((data: { message_id: number }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === data.message_id ? { ...m, is_read: true } : m
        )
      );
    }, [])
  );

  return {
    messages,
    isLoading,
  };
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageData) => messagesService.sendMessage(data),
    onSuccess: (_, variables) => {
      // Invalidate conversations to update last message
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      // Invalidate the specific conversation
      queryClient.invalidateQueries({
        queryKey: ['conversation', variables.receiver_id],
      });
    },
  });
};

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: number) => messagesService.markAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

// Hook for unread message count
export const useUnreadCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: conversations } = useConversations();

  useEffect(() => {
    if (conversations) {
      const count = conversations.reduce(
        (sum, conv) => sum + conv.unread_count,
        0
      );
      setUnreadCount(count);
    }
  }, [conversations]);

  // Subscribe to new messages globally
  useRealtimeSubscription(
    'user_messages',
    'new_message',
    useCallback(() => {
      setUnreadCount((prev) => prev + 1);
    }, [])
  );

  return unreadCount;
};
