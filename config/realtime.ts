// Xano Realtime Configuration
export const XANO_REALTIME_CONFIG = {
  // Replace with your Xano instance URL (without https://)
  INSTANCE_URL: process.env.EXPO_PUBLIC_XANO_API_URL?.replace('https://', '').split('/')[0] || '',
  // WebSocket URL for Xano realtime
  WS_URL: process.env.EXPO_PUBLIC_XANO_REALTIME_URL || '',
};

// Realtime channel types
export enum RealtimeChannel {
  MESSAGES = 'messages',
  APPOINTMENTS = 'appointments',
  NOTIFICATIONS = 'notifications',
}

// Realtime event types
export enum RealtimeEvent {
  MESSAGE_SENT = 'message_sent',
  MESSAGE_DELIVERED = 'message_delivered',
  MESSAGE_READ = 'message_read',
  APPOINTMENT_UPDATED = 'appointment_updated',
  NOTIFICATION_RECEIVED = 'notification_received',
}
