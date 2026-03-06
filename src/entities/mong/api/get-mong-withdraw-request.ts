export type GetMongWithdrawRequest =
  | {
      createType: 'VIEW_MY_HAIR_CONSULTATIONS_ANSWERS_MODEL';
      refType: 'HairConsultationsAnswers';
      refId: number | string;
    }
  | {
      createType: 'EXPERIENCE_GROUPS_LINK_DESIGNER';
      refType: 'ExperienceGroups';
      refId: number | string;
    }
  | {
      createType: 'OPEN_RECEIVED_CHAT_DESIGNER';
      firestoreRefType:
        | 'userJobPostingChatChannels'
        | 'userModelMatchingChatChannels'
        | 'userHairConsultationChatChannels';
      firestoreRefId: string;
    };
