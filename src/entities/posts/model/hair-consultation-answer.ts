import type {
  HairConsultationAnswerFaceShape,
  HairConsultationAnswerHairCurl,
  HairConsultationAnswerHairLayer,
  HairConsultationAnswerHairLength,
  HairConsultationAnswerPriceType,
} from '@/entities/posts/api/create-hair-consultation-answer-request';

import type { USER_ROLE } from '@/entities/user/constants/user-role';
import type { ValueOf } from '@/shared/type/types';

export type HairConsultationAnswerUser = {
  id: number;
  displayName: string;
  profilePictureURL: string | null;
  role: ValueOf<typeof USER_ROLE>;
};

export type HairConsultationAnswer = {
  id: number;
  hairConsultationId: number;
  userId: number;
  faceShape: HairConsultationAnswerFaceShape;
  bangsTypes: string[];
  hairLengths: HairConsultationAnswerHairLength[];
  isHairLengthAdvice: boolean | number;
  hairLayers: HairConsultationAnswerHairLayer[] | null;
  isHairLayerAdvice: boolean | number;
  hairCurls: HairConsultationAnswerHairCurl[];
  isHairCurlAdvice: boolean | number;
  title: string;
  minPrice: number | null;
  maxPrice: number | null;
  priceType: HairConsultationAnswerPriceType;
  price: number | null;
  styleImages?: string[];
  createdAt: string;
  updatedAt: string;
  user: HairConsultationAnswerUser;
};
