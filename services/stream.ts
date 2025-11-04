import { apiService } from './api';

export const streamService = {
  // Get Stream user token from backend
  // The backend should generate a valid Stream token for the user
  getChatToken: async (userId: number): Promise<string> => {
    try {
      const response = await apiService.post<{ token: string }>(
        '/stream/chat-token',
        { user_id: userId }
      );
      return response.token;
    } catch (error) {
      console.error('Failed to get Stream chat token:', error);
      throw error;
    }
  },

  // Get Stream video token from backend
  getVideoToken: async (userId: number): Promise<string> => {
    try {
      const response = await apiService.post<{ token: string }>(
        '/stream/video-token',
        { user_id: userId }
      );
      return response.token;
    } catch (error) {
      console.error('Failed to get Stream video token:', error);
      throw error;
    }
  },

  // Create or get a channel for conversation
  createConversationChannel: async (
    otherUserId: number
  ): Promise<{ channel_id: string; channel_cid: string }> => {
    try {
      const response = await apiService.post<{
        channel_id: string;
        channel_cid: string;
      }>('/stream/create-channel', {
        other_user_id: otherUserId,
      });
      return response;
    } catch (error) {
      console.error('Failed to create conversation channel:', error);
      throw error;
    }
  },
};
