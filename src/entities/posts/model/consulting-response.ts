import type { BANG_STYLE_LABEL } from '@/features/posts/constants/bang-style';
import type { FACE_SHAPE_LABEL } from '@/features/posts/constants/face-shape';
import type { HAIR_TYPE_LABEL } from '@/features/posts/constants/hair-type';
import type { ValueOf } from '@/shared/type/types';

export type ConsultingResponseStyle = {
  images: string[];
  description: string;
};

export type ConsultingResponseTreatment = {
  treatmentName: string;
  minPrice: number;
  maxPrice: number;
};

type ConsultingResponseDesigner = {
  id: number;
  name: string;
  profileImageUrl: string;
  companyName: string;
};

export type ConsultingResponseAnswer = {
  id: number;
  faceShape: ValueOf<typeof FACE_SHAPE_LABEL>;
  hairType?: ValueOf<typeof HAIR_TYPE_LABEL>;
  damageLevel?: string;
  bangsRecommendation: ValueOf<typeof BANG_STYLE_LABEL>;
  style: ConsultingResponseStyle;
  treatments: ConsultingResponseTreatment[];
  comment?: string;
  isStoreConsultNeed: boolean;
  designer: ConsultingResponseDesigner;
  createdAt: string;
  updatedAt: string;
};

export type ConsultingResponse = {
  hasAnswer: boolean;
  answer?: ConsultingResponseAnswer;
};
