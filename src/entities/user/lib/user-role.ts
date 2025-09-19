import type { UserHairConsultationChatChannelTypeOtherUser } from '@/features/chat/type/user-hair-consultation-chat-channel-type';

import { USER_ROLE } from '../constants/user-role';
import type { User } from '../model/user';

export function isModel(user: User | UserHairConsultationChatChannelTypeOtherUser): boolean {
  if ('role' in user) {
    return user.role === USER_ROLE.MODEL;
  }
  return user.Role === USER_ROLE.MODEL;
}

export function isDesigner(user: User | UserHairConsultationChatChannelTypeOtherUser): boolean {
  if ('role' in user) {
    return user.role === USER_ROLE.DESIGNER;
  }
  return user.Role === USER_ROLE.DESIGNER;
}
