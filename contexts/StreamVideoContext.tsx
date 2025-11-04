import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamVideoClient, User } from '@stream-io/video-react-native-sdk';
import { useAuth } from '../hooks/useAuth';
import { STREAM_CONFIG, getStreamUserId } from '../config/stream';
import { streamService } from '../services/stream';

type StreamVideoContextType = {
  client: StreamVideoClient | null;
  isConnecting: boolean;
  isConnected: boolean;
};

const StreamVideoContext = createContext<StreamVideoContextType>({
  client: null,
  isConnecting: false,
  isConnected: false,
});

export const useStreamVideo = () => useContext(StreamVideoContext);

export const StreamVideoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
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

    const setupVideo = async () => {
      try {
        setIsConnecting(true);

        const streamUser: User = {
          id: getStreamUserId(user.id),
          name: `${user.first_name} ${user.last_name}`,
          image: user.profile_photo,
        };

        // Get token from backend
        let token: string;
        try {
          token = await streamService.getVideoToken(user.id);
        } catch (error) {
          console.warn('Using development token for video. Please implement backend token generation.');
          // For development only - you'll need to generate a proper token
          // In production, this MUST come from your backend
          token = StreamVideoClient.getOrCreateInstance({
            apiKey: STREAM_CONFIG.API_KEY,
            user: streamUser,
          }).tokenProvider();
        }

        // Create Stream Video client
        const videoClient = StreamVideoClient.getOrCreateInstance({
          apiKey: STREAM_CONFIG.API_KEY,
          user: streamUser,
          token,
        });

        setClient(videoClient);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to setup Stream Video:', error);
      } finally {
        setIsConnecting(false);
      }
    };

    setupVideo();

    // Cleanup on unmount
    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [user, isAuthenticated]);

  return (
    <StreamVideoContext.Provider value={{ client, isConnecting, isConnected }}>
      {children}
    </StreamVideoContext.Provider>
  );
};
