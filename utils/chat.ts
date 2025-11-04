import { StreamChat } from 'stream-chat';
import { getStreamUserId, getChannelId } from '../config/stream';

/**
 * Create or get a channel for conversation between two users
 */
export const createOrGetChannel = async (
  client: StreamChat,
  currentUserId: number,
  otherUserId: number,
  otherUserName: string,
  otherUserPhoto?: string
) => {
  try {
    const channelId = getChannelId(currentUserId, otherUserId);

    const channel = client.channel('messaging', channelId, {
      members: [getStreamUserId(currentUserId), getStreamUserId(otherUserId)],
      name: `Chat with ${otherUserName}`,
    });

    await channel.watch();

    return channel;
  } catch (error) {
    console.error('Error creating/getting channel:', error);
    throw error;
  }
};

/**
 * Send a message to start a conversation
 */
export const sendMessage = async (
  client: StreamChat,
  currentUserId: number,
  otherUserId: number,
  otherUserName: string,
  message: string,
  otherUserPhoto?: string
) => {
  try {
    const channel = await createOrGetChannel(
      client,
      currentUserId,
      otherUserId,
      otherUserName,
      otherUserPhoto
    );

    await channel.sendMessage({
      text: message,
    });

    return channel;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
