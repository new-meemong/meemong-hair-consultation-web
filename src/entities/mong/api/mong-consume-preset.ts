export type MongConsumePresetType =
  | 'CHAT'
  | 'THUNDER_ANNOUNCEMENTS'
  | 'HAIR_CONSULTING'
  | 'INSTAGRAM'
  | 'RESERVATIONS'
  | 'EXPERIENCE_GROUPS';

export type MongConsumePresetSubType =
  | 'RECOMMEND_MODEL_CHAT'
  | 'NEW_MODEL_CHAT'
  | 'MALE_MODEL_CHAT'
  | 'FEMALE_MODEL_CHAT'
  | 'NEARBY_MODEL_CHAT'
  | 'BEAUTY_MODEL_CHAT'
  | 'DESIGNER_DEFAULT'
  | 'DESIGNER_PREMIUM'
  | 'MODEL_DEFAULT'
  | 'MODEL_PREMIUM'
  | 'THUNDER_ANNOUNCEMENTS_DEFAULT_DESIGNER'
  | 'THUNDER_ANNOUNCEMENTS_DEFAULT_MODEL'
  | 'THUNDER_ANNOUNCEMENTS_PREMIUM_DESIGNER'
  | 'THUNDER_ANNOUNCEMENTS_PREMIUM_MODEL'
  | 'CLICK_INSTAGRAM_MODEL'
  | 'VIEW_MY_HAIR_CONSULTING_ANSWER_MODEL'
  | 'RESERVATIONS_DESIGNER'
  | 'EXPERIENCE_GROUPS_LINK_DESIGNER'
  | '';

export type MongConsumePreset = {
  id: number;
  title: string;
  type: MongConsumePresetType;
  subType: MongConsumePresetSubType | '';
  price: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
