import type { HairConsultationChatMessageTypeEnum } from './hair-consultation-chat-message-type';

export type sendAppMessageType = {
  type: HairConsultationChatMessageTypeEnum;
  postUrl: string;
  postUserId: string;
};
