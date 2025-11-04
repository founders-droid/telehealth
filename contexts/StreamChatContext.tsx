import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { useAuth } from '../hooks/useAuth';
import { STREAM_CONFIG, getStreamUserId } from '../config/stream';
import { streamService } from '../services/stream';

type StreamChatContextType = {
  client: StreamChat | null;
  isConnecting: boolean;
  isConnected: boolean;
};

const StreamChatContext = createContext<StreamChatContextType>({
  client: null,
  isConnecting: false,
  isConnected: false,
});

export const useStreamChat = () => useContext(StreamChatContext);

export const StreamChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Disconnect if user logs out
      if (client) {
        client.disconnectUser();
        setClient(null);
        setIsConnected(false);
      }
      return;
    }

    const setupChat = async () => {
      try {
        setIsConnecting(true);

        // Create Stream Chat client
        const chatClient = StreamChat.getInstance(STREAM_CONFIG.API_KEY);

        // Get token from backend
        // For development, you can use a development token
        // In production, this MUST come from your backend
        let token: string;
        try {
          token = await streamService.getChatToken(user.id);
        } catch (error) {
          console.warn('Using development token. Please implement backend token generation.');
          // For development only - generate a dev token
          // In production, remove this and always get token from backend
          token = chatClient.devToken(getStreamUserId(user.id));
        }

        // Connect user
        await chatClient.connectUser(
          {
            id: getStreamUserId(user.id),
            name: `${user.first_name} ${user.last_name}`,
            image: user.profile_photo,
            role: user.role,
          },
          token
        );

        setClient(chatClient);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to setup Stream Chat:', error);
      } finally {
        setIsConnecting(false);
      }
    };

    setupChat();

    // Cleanup on unmount
    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [user, isAuthenticated]);

  return (
    <StreamChatContext.Provider value={{ client, isConnecting, isConnected }}>
      {children}
    </StreamChatContext.Provider>
  );
};
