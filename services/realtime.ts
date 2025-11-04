import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../utils/constants';

type MessageCallback = (data: any) => void;
type EventSubscription = {
  channel: string;
  event: string;
  callback: MessageCallback;
};

class RealtimeService {
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, EventSubscription[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private isAuthenticated = false;

  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);

      if (!token) {
        throw new Error('No auth token available');
      }

      // For Xano, the WebSocket URL typically follows this pattern:
      // wss://your-instance.xano.io/api:your-api-group/realtime
      const wsUrl = process.env.EXPO_PUBLIC_XANO_REALTIME_URL ||
                    `${process.env.EXPO_PUBLIC_XANO_API_URL?.replace('https://', 'wss://').replace('http://', 'ws://')}/realtime`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;

        // Authenticate with Xano
        this.authenticate(token);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.isAuthenticated = false;
        this.handleReconnect();
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.isConnecting = false;
      throw error;
    }
  }

  private authenticate(token: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.send({
        type: 'auth',
        token,
      });
    }
  }

  private handleMessage(data: any): void {
    // Handle authentication response
    if (data.type === 'auth_success') {
      this.isAuthenticated = true;
      console.log('WebSocket authenticated');

      // Resubscribe to channels after reconnect
      this.resubscribeAll();
      return;
    }

    if (data.type === 'auth_error') {
      console.error('WebSocket authentication failed:', data.message);
      this.disconnect();
      return;
    }

    // Handle channel messages
    const { channel, event, payload } = data;

    if (channel && event) {
      const subscriptionKey = `${channel}:${event}`;
      const subscriptions = this.subscriptions.get(subscriptionKey) || [];

      subscriptions.forEach((sub) => {
        try {
          sub.callback(payload);
        } catch (error) {
          console.error('Error in subscription callback:', error);
        }
      });
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      console.log(`Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts})`);

      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  subscribe(channel: string, event: string, callback: MessageCallback): () => void {
    const subscriptionKey = `${channel}:${event}`;
    const subscription: EventSubscription = { channel, event, callback };

    const existing = this.subscriptions.get(subscriptionKey) || [];
    this.subscriptions.set(subscriptionKey, [...existing, subscription]);

    // Send subscribe message to Xano
    if (this.isAuthenticated) {
      this.send({
        type: 'subscribe',
        channel,
        event,
      });
    }

    // Return unsubscribe function
    return () => {
      this.unsubscribe(channel, event, callback);
    };
  }

  private unsubscribe(channel: string, event: string, callback: MessageCallback): void {
    const subscriptionKey = `${channel}:${event}`;
    const existing = this.subscriptions.get(subscriptionKey) || [];

    const filtered = existing.filter((sub) => sub.callback !== callback);

    if (filtered.length === 0) {
      this.subscriptions.delete(subscriptionKey);

      // Send unsubscribe message to Xano
      if (this.isAuthenticated) {
        this.send({
          type: 'unsubscribe',
          channel,
          event,
        });
      }
    } else {
      this.subscriptions.set(subscriptionKey, filtered);
    }
  }

  private resubscribeAll(): void {
    this.subscriptions.forEach((subs, key) => {
      if (subs.length > 0) {
        const { channel, event } = subs[0];
        this.send({
          type: 'subscribe',
          channel,
          event,
        });
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscriptions.clear();
    this.isAuthenticated = false;
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN && this.isAuthenticated;
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();
