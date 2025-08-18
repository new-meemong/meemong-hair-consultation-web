import type { HAIR_CONCERN_OPTION_LABEL } from '@/features/posts/constants/hair-concern-option';
import type { SKIN_TONE_OPTION_LABEL } from '@/features/posts/constants/skin-tone';
import type { ValueOf } from '@/shared/type/types';

export type CreateConsultingPostRequest = {
  title: string;
  content?: string;
  hairConcern: ValueOf<typeof HAIR_CONCERN_OPTION_LABEL>;
  hasNoRecentTreatment: boolean;
  skinTone?: ValueOf<typeof SKIN_TONE_OPTION_LABEL>;
  treatments?: {
    treatmentName: string;
    treatmentDate: string; // yyyy.mm 형식
  }[];
  myImages?: {
    frontLooseImageUrl: string;
    frontTiedImageUrl: string;
    sideTiedImageUrl: string;
    upperBodyImageUrl: string;
  };
  aspirationImages?: {
    images: string[];
    description?: string;
  };
};
