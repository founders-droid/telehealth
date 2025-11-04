import { User } from './user';

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  appointment_id?: number;
  message_text: string;
  attachment?: string;
  is_read: boolean;
  created_at: string;
  sender?: User;
  receiver?: User;
}

export interface SendMessageData {
  receiver_id: number;
  appointment_id?: number;
  message_text: string;
  attachment?: string;
}

export interface Conversation {
  user: User;
  last_message: Message;
  unread_count: number;
}
