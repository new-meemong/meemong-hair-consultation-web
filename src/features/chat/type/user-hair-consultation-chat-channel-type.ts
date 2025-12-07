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
  postId?: string | null; // 게시물 ID (null: 다른 사람 글에서 채팅 시작한 경우)
  answerId?: string | null; // 컨설팅 답변 ID (null: 답변이 없는 경우 또는 다른 사람 글에서 채팅 시작한 경우)
  entrySource?: ChatEntrySource;

  lastReadAt: Timestamp | FieldValue | null;

  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  deletedAt: Timestamp | FieldValue | null;

  otherUser: User;
}
