// Stream Configuration
export const STREAM_CONFIG = {
  API_KEY: process.env.EXPO_PUBLIC_STREAM_API_KEY || '1444513',
  APP_ID: process.env.EXPO_PUBLIC_STREAM_APP_ID || '1444513',
};

// Generate Stream user ID from app user ID
export const getStreamUserId = (userId: number): string => {
  return `user_${userId}`;
};

// Generate Stream channel ID for conversation
export const getChannelId = (userId1: number, userId2: number): string => {
  // Sort IDs to ensure consistent channel ID regardless of order
  const [id1, id2] = [userId1, userId2].sort((a, b) => a - b);
  return `conversation_${id1}_${id2}`;
};

// Generate Stream call ID for video consultation
export const getCallId = (appointmentId: number): string => {
  return `appointment_${appointmentId}`;
};
