import { FieldValue, Timestamp } from 'firebase/firestore';

import type { User } from '@/entities/user/model/user';

import type { HairConsultationChatMessageType } from './hair-consultation-chat-message-type';

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
