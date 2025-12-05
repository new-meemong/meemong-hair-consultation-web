import { FieldValue, Timestamp } from 'firebase/firestore';

import type { User } from '@/entities/user/model/user';

import type { ChatEntrySource } from './hair-consultation-chat-channel-type';
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

  // 게시물 관련 정보 (채널과 동일하게 저장)
  postId?: string;
  answerId?: string;
  entrySource?: ChatEntrySource;

  lastReadAt: Timestamp | FieldValue | null;

  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  deletedAt: Timestamp | FieldValue | null;

  otherUser: User;
}
