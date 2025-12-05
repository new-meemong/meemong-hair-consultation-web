import { FieldValue, Timestamp } from 'firebase/firestore';

import type { User } from '@/entities/user/model/user';

export type ChatEntrySource = 'PROFILE' | 'CONSULTING_RESPONSE' | 'POST_COMMENT' | 'TOP_ADVISOR';

export interface HairConsultationChatChannelType {
  id: string; // 채널 ID
  channelKey: string; // `${channelType}_${참여자ID들.정렬().join('_')}`
  participantsIds: string[]; // 참여자 ID 목록
  channelOpenUserId: string; // 채널을 연 사용자 ID

  // 게시물 관련 정보
  postId?: string; // 게시물 ID
  answerId?: string; // 컨설팅 답변 ID (있는 경우)
  entrySource?: ChatEntrySource; // 진입 경로 (통계용)

  createdAt: Timestamp | FieldValue; // 생성 시간
  updatedAt: Timestamp | FieldValue; // 마지막 업데이트 시간

  otherUser?: User; // 상대방 유저 정보, 별도로 API 호출

  // 하위 컬렉션
  // messages/{messageId}: JobPostingChatMessageType - 채널 메시지
}
