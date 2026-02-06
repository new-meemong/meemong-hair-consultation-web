import type { CONSULT_TYPE } from '../constants/consult-type';
import type { MY_IMAGE_TYPE } from '@/features/posts/constants/my-image-type';
import type { SKIN_TONE_OPTION_LABEL } from '@/features/posts/constants/skin-tone';
import type { USER_ROLE } from '@/entities/user/constants/user-role';
import type { USER_SEX } from '@/entities/user/constants/user-sex';
import type { ValueOf } from '@/shared/type/types';

export type Treatment = {
  treatmentName: string;
  treatmentDate: string;
  treatmentArea?: string | null;
  decolorizationCount?: number | null;
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
  hairLength?: string | null;
  hairTexture?: string | null;
  skinBrightness?: string | null;
  personalColor?: string | null;
  hasNoRecentTreatment?: boolean;
  skinTone?: ValueOf<typeof SKIN_TONE_OPTION_LABEL> | null;
  treatments?: Treatment[];
  myImageList?: MyImage[];
  aspirations?: Aspirations;
  isAnsweredByDesigner?: boolean;
  minPaymentPrice: number | null;
  maxPaymentPrice: number | null;
  desiredDateType?: string | null;
  desiredDate?: string | null;
};
