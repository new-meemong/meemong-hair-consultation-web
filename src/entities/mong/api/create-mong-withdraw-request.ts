/**
 * 몽 차감 요청 타입
 * createType에 따라 다른 필드가 필요합니다.
 */
export type CreateMongWithdrawRequest =
  | {
      // 채팅 차감
      createType:
        | 'RECOMMEND_MODEL_CHAT'
        | 'NEW_MODEL_CHAT'
        | 'MALE_MODEL_CHAT'
        | 'FEMALE_MODEL_CHAT'
        | 'NEARBY_MODEL_CHAT'
        | 'BEAUTY_MODEL_CHAT'
        | 'FAVORITE_MODEL_CHAT';
      mongType?: 'event' | 'default';
    }
  | {
      // 인스타그램 차감
      createType: 'CLICK_INSTAGRAM_MODEL';
      mongType?: 'event' | 'default';
      refId: number; // Users.id
      refType: 'Users';
    }
  | {
      // 체험단 링크 클릭 차감
      createType: 'EXPERIENCE_GROUPS_LINK_DESIGNER';
      mongType?: 'event' | 'default';
      refId: number; // Users.id
      refType: 'ExperienceGroups';
    }
  | {
      // 헤어 컨설팅 답변 보기 차감
      createType: 'VIEW_MY_HAIR_CONSULTING_ANSWER_MODEL';
      mongType?: 'event' | 'default';
      refId: number; // HairConsultPostingsAnswers.id
      refType: 'hairConsultPostingsAnswers';
    };
