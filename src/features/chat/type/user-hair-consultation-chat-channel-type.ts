import { FieldValue, Timestamp } from 'firebase/firestore';

import type { HairConsultationChatMessageType } from './hair-consultation-chat-message-type';
import type { User } from '@/entities/user/model/user';

export interface UserHairConsultationChatChannelType {
  channelId: string;
  unreadCount: number | FieldValue;
  isBlockChannel: boolean;

  lastMessage: HairConsultationChatMessageType;

  isPinned: boolean;
  pinnedAt: Timestamp | FieldValue | null;

  otherUserId: string;
  userId: string;

  lastReadAt: Timestamp | FieldValue | null;

  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  deletedAt: Timestamp | FieldValue | null;

  otherUser: User;
}
