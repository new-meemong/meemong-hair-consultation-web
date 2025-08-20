import type { BANG_STYLE_LABEL } from '@/features/posts/constants/bang-style';
import type { FACE_SHAPE_LABEL } from '@/features/posts/constants/face-shape';
import type { HAIR_TYPE_LABEL } from '@/features/posts/constants/hair-type';
import type { ValueOf } from '@/shared/type/types';

export type CreateConsultingResponseRequest = {
  faceShape: ValueOf<typeof FACE_SHAPE_LABEL>;
  hairType?: ValueOf<typeof HAIR_TYPE_LABEL>;
  damageLevel?: number;
  bangsRecommendation: ValueOf<typeof BANG_STYLE_LABEL>;
  style: {
    images: string[];
    description: string;
  };
  treatments: {
    treatmentName: string;
    minPrice: number;
    maxPrice: number;
  }[];
  comment?: string;
};
