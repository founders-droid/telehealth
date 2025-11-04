import { apiService } from './api';
import { API_ENDPOINTS } from '../config/xano';
import { Message, SendMessageData, Conversation } from '../types';

export const messagesService = {
  // Send new message
  sendMessage: async (data: SendMessageData): Promise<Message> => {
    return apiService.post<Message>(API_ENDPOINTS.MESSAGES.SEND, data);
  },

  // Get conversation with a specific user
  getConversation: async (userId: number): Promise<Message[]> => {
    return apiService.get<Message[]>(API_ENDPOINTS.MESSAGES.CONVERSATION(userId));
  },

  // Get all conversations
  getConversations: async (): Promise<Conversation[]> => {
    return apiService.get<Conversation[]>(API_ENDPOINTS.MESSAGES.CONVERSATIONS);
  },

  // Mark message as read
  markAsRead: async (messageId: number): Promise<void> => {
    return apiService.put(API_ENDPOINTS.MESSAGES.MARK_READ(messageId));
  },
};
