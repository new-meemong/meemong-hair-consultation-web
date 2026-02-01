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
  faceShape: HairConsultationAnswerFaceShape;
  bangsTypes: string[];
  hairLengths: HairConsultationAnswerHairLength[];
  isHairLengthAdvice: boolean;
  hairLayers: HairConsultationAnswerHairLayer[] | null;
  isHairLayerAdvice: boolean;
  hairCurls: HairConsultationAnswerHairCurl[];
  isHairCurlAdvice: boolean;
  title: string;
  minPrice: number | null;
  maxPrice: number | null;
  priceType: HairConsultationAnswerPriceType;
  price: number | null;
  updatedAt: string;
  createdAt: string;
};

export type CreateHairConsultationAnswerResponse = {
  data: HairConsultationAnswer;
};
