import type { HAIR_CONCERN_OPTION_LABEL } from '@/features/posts/constants/hair-concern-option';
import type { MY_IMAGE_TYPE } from '@/features/posts/constants/my-image-type';
import type { SKIN_TONE_OPTION_LABEL } from '@/features/posts/constants/skin-tone';
import type { ValueOf } from '@/shared/type/types';

export type CreateConsultingPostRequest = {
  title: string;
  content?: string;
  hairConcern: ValueOf<typeof HAIR_CONCERN_OPTION_LABEL>;
  hairConcernDetail?: string;
  hasNoRecentTreatment: boolean;
  skinTone?: ValueOf<typeof SKIN_TONE_OPTION_LABEL>;
  treatments?: {
    treatmentName: string;
    treatmentDate: string; // yyyy.mm 형식
  }[];
  myImageList: {
    type: ValueOf<typeof MY_IMAGE_TYPE>;
    imageUrl: string;
  }[]
  aspirations?: {
    images: string[];
    description?: string;
  };
  minPaymentPrice: number | null;
  maxPaymentPrice: number | null;
};
