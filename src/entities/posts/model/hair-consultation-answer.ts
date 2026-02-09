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
  faceShape: HairConsultationAnswerFaceShape | null;
  isFaceShapeAdvice: boolean | number | null;
  bangsTypes: string[];
  isBangsTypeAdvice: boolean | number | null;
  hairLengths: HairConsultationAnswerHairLength[];
  isHairLengthAdvice: boolean | number | null;
  hairLayers: HairConsultationAnswerHairLayer[] | null;
  isHairLayerAdvice: boolean | number | null;
  hairCurls: HairConsultationAnswerHairCurl[];
  isHairCurlAdvice: boolean | number | null;
  title: string;
  description?: string | null;
  styleImages?: string[];
  minPrice: number | null;
  maxPrice: number | null;
  priceType: HairConsultationAnswerPriceType;
  price: number | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  user: HairConsultationAnswerUser;
};
