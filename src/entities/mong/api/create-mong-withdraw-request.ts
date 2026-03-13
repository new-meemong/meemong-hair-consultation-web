/**
 * 몽 차감 요청 타입
 * createType에 따라 다른 필드가 필요합니다.
 */
type MongType = 'event' | 'default';

type ChatWithdrawCreateType =
  | 'RECOMMEND_MODEL_CHAT'
  | 'NEW_MODEL_CHAT'
  | 'MALE_MODEL_CHAT'
  | 'FEMALE_MODEL_CHAT'
  | 'NEARBY_MODEL_CHAT'
  | 'BEAUTY_MODEL_CHAT'
  | 'FAVORITE_MODEL_CHAT'
  | 'RECOMMENDER_DESIGNER_CHAT'
  | 'FAVORITE_NOTIFICATION_CHAT_DESIGNER'
  | 'FAVORITE_NOTIFICATION_CHAT_MODEL'
  | 'VIEW_HAIR_CONSULTATION_ANSWER_NOTIFICATION_CHAT_DESIGNER'
  | 'VIEW_STORELINK_NOTIFICATION_CHAT_DESIGNER'
  | 'VIEW_INSTAGRAM_NOTIFICATION_CHAT_DESIGNER'
  | 'MY_HAIR_CONSULTATIONS_ANSWER_CHAT_MODEL'
  | 'MY_HAIR_CONSULTATIONS_COMMENT_CHAT_MODEL'
  | 'OTHER_HAIR_CONSULTATIONS_ANSWER_CHAT_MODEL'
  | 'OTHER_HAIR_CONSULTATIONS_COMMENT_CHAT_MODEL'
  | 'THUNDER_ANNOUNCEMENTS_DEFAULT_CHAT_MODEL'
  | 'THUNDER_ANNOUNCEMENTS_DEFAULT_CHAT_DESIGNER'
  | 'HAIR_CONSULTATIONS_TOP_ADVISORS_CHAT_MODEL';
// NOTE:
// 'HAIR_CONSULTATIONS_COMMENTS_DESIGNER'는 댓글 POST API에서 과금되므로
// withdraw createType 목록에 포함하지 않습니다.

export type CreateMongWithdrawRequest =
  | {
      // 채팅 차감
      createType: ChatWithdrawCreateType;
      mongType?: MongType;
    }
  | {
      // 받은 채팅 차감
      createType: 'OPEN_RECEIVED_CHAT_DESIGNER';
      mongType?: MongType;
      firestoreRefType:
        | 'userJobPostingChatChannels'
        | 'userModelMatchingChatChannels'
        | 'userHairConsultationChatChannels';
      firestoreRefId: string;
    }
  | {
      // 인스타그램 차감
      createType: 'CLICK_INSTAGRAM_MODEL';
      mongType?: MongType;
      refId: number; // Users.id
      refType: 'Users';
    }
  | {
      // 체험단 링크 클릭 차감
      createType: 'EXPERIENCE_GROUPS_LINK_DESIGNER';
      mongType?: MongType;
      refId: number; // ExperienceGroups.id
      refType: 'ExperienceGroups';
    }
  | {
      // 레거시: 헤어 컨설팅 답변 보기 차감
      createType: 'VIEW_MY_HAIR_CONSULTATIONS_ANSWERS_MODEL';
      mongType?: MongType;
      refId: number; // HairConsultationsAnswers.id
      refType: 'HairConsultationsAnswers';
    };
