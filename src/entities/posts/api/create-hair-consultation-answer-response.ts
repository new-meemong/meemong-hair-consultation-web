import type {
  HairConsultationAnswerFaceShape,
  HairConsultationAnswerHairCurl,
  HairConsultationAnswerHairLayer,
  HairConsultationAnswerHairLength,
  HairConsultationAnswerPriceType,
} from './create-hair-consultation-answer-request';

export type HairConsultationAnswer = {
  id: number;
  hairConsultationId: number;
  userId: number;
  faceShape: HairConsultationAnswerFaceShape | null;
  isFaceShapeAdvice: boolean;
  bangsTypes: string[];
  isBangsTypeAdvice: boolean;
  hairLengths: HairConsultationAnswerHairLength[];
  isHairLengthAdvice: boolean | null;
  hairLayers: HairConsultationAnswerHairLayer[] | null;
  isHairLayerAdvice: boolean | null;
  hairCurls: HairConsultationAnswerHairCurl[];
  isHairCurlAdvice: boolean | null;
  title: string;
  styleImages?: string[];
  minPrice: number | null;
  maxPrice: number | null;
  priceType: HairConsultationAnswerPriceType;
  price: number | null;
  description: string | null;
  updatedAt: string;
  createdAt: string;
};

export type CreateHairConsultationAnswerResponse = {
  data: HairConsultationAnswer;
};
