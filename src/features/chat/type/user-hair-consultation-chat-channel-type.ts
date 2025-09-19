import { FieldValue, Timestamp } from 'firebase/firestore';

import type { USER_ROLE } from '@/entities/user/constants/user-role';
import type { ValueOf } from '@/shared/type/types';

import type { HairConsultationChatMessageType } from './hair-consultation-chat-message-type';

export interface UserHairConsultationChatChannelTypeOtherUser {
  DisplayName: string;
  Email: string;
  FcmToken: string | null;
  Korean: string;
  ProfilePictureURL: string | null;
  Role: ValueOf<typeof USER_ROLE>;
  Sex: string;
  UserID: string | null;
  id: number;
  profileUrl: string | null;
}

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

  otherUser: UserHairConsultationChatChannelTypeOtherUser;
}
