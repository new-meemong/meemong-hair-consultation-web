import type { User } from '@/entities/user/model/user';
import { FieldValue, Timestamp } from 'firebase/firestore';

export interface HairConsultationChatChannelType {
  id: string; // 채널 ID
  // TODO: 헤어상담에서 추가할 값 있는지 확인 필요
  channelKey: string; // `${channelType}_${참여자ID들.정렬().join('_')}`
  participantsIds: string[]; // 참여자 ID 목록
  channelOpenUserId: string; // 채널을 연 사용자 ID

  createdAt: Timestamp | FieldValue; // 생성 시간
  updatedAt: Timestamp | FieldValue; // 마지막 업데이트 시간

  otherUser?: User; // 상대방 유저 정보, 별도로 API 호출

  // 하위 컬렉션
  // messages/{messageId}: JobPostingChatMessageType - 채널 메시지
}
