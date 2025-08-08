import { FieldValue, Timestamp } from 'firebase/firestore';

export enum HairConsultationChatMessageTypeEnum {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  SYSTEM = 'system',
}

export interface MetaPathType {
  [key: string]: string;
}

export interface HairConsultationChatMessageType {
  id: string;
  message: string;
  messageType: HairConsultationChatMessageTypeEnum;
  metaPathList: MetaPathType[];
  senderId: string;

  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}
