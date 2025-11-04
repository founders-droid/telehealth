import { useEffect, useState } from 'react';
import { realtimeService } from '../services/realtime';
import { useAuth } from './useAuth';

export const useRealtime = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Connect to realtime service
      realtimeService.connect().catch((error) => {
        console.error('Failed to connect to realtime service:', error);
      });

      // Check connection status periodically
      const interval = setInterval(() => {
        setIsConnected(realtimeService.isConnected());
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    } else {
      // Disconnect when user logs out
      realtimeService.disconnect();
      setIsConnected(false);
    }
  }, [isAuthenticated]);

  return { isConnected };
};

export const useRealtimeSubscription = (
  channel: string,
  event: string,
  callback: (data: any) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = realtimeService.subscribe(channel, event, callback);

    return () => {
      unsubscribe();
    };
  }, [channel, event, enabled]);
};
