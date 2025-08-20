import type { USER_ROLE } from '@/entities/user/constants/user-role';
import type { USER_SEX } from '@/entities/user/constants/user-sex';
import type { SKIN_TONE_OPTION_LABEL } from '@/features/posts/constants/skin-tone';
import type { ValueOf } from '@/shared/type/types';

import type { CONSULTING_TYPE } from '../constants/consulting-type';

type Treatment = {
  treatmentName: string;
  treatmentDate: string;
};

type MyImages = {
  frontLooseImageUrl: string;
  frontTiedImageUrl: string;
  sideTiedImageUrl: string;
  upperBodyImageUrl: string;
};

type AspirationImage = {
  images: string[];
  description?: string;
};

export type PostDetail = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  images?: string[];
  isFavorited: boolean;
  likeCount: number;
  commentCount: number;
  isPhotoVisibleToDesigner: boolean;
  consultType: ValueOf<typeof CONSULTING_TYPE>;
  hairConsultPostingCreateUserName: string;
  hairConsultPostingCreateUserProfileImageUrl: string | null;
  hairConsultPostingCreateUserRegion: string | null;
  hairConsultPostingCreateUserSex: ValueOf<typeof USER_SEX>;
  hairConsultPostingCreateUserRole: ValueOf<typeof USER_ROLE>;
  hairConsultPostingCreateUserId: number;
  hairConcern?: string;
  hairConcernDetail?: string | null;
  hasNoRecentTreatment?: boolean;
  skinTone?: ValueOf<typeof SKIN_TONE_OPTION_LABEL> | null;
  treatments?: Treatment[];
  myImages?: MyImages;
  aspirationImages?: AspirationImage | null;
};
