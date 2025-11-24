import type { USER_ROLE } from '@/entities/user/constants/user-role';
import type { USER_SEX } from '@/entities/user/constants/user-sex';
import type { MY_IMAGE_TYPE } from '@/features/posts/constants/my-image-type';
import type { SKIN_TONE_OPTION_LABEL } from '@/features/posts/constants/skin-tone';
import type { ValueOf } from '@/shared/type/types';

import type { CONSULT_TYPE } from '../constants/consult-type';

export type Treatment = {
  treatmentName: string;
  treatmentDate: string;
};

type MyImage = {
  type: ValueOf<typeof MY_IMAGE_TYPE>;
  imageUrl: string;
};

type Aspirations = {
  aspirationImages: string[];
  aspirationDescription: string | null;
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
  viewCount: number;
  isPhotoVisibleToDesigner: boolean;
  consultType: ValueOf<typeof CONSULT_TYPE>;
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
  myImageList?: MyImage[];
  aspirations?: Aspirations;
  isAnsweredByDesigner?: boolean;
  minPaymentPrice: number | null;
  maxPaymentPrice: number | null;
};
