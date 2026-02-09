export type HairConsultationAnswerFaceShape =
  | '마름모형'
  | '네모형'
  | '하트형'
  | '땅콩형'
  | '육각형'
  | '둥근형'
  | '긴 얼굴형'
  | '계란형';

export type HairConsultationAnswerHairLength =
  | '크롭'
  | '숏'
  | '미디엄'
  | '미디엄롱'
  | '롱'
  | '장발'
  | '숏컷'
  | '단발'
  | '중단발';

export type HairConsultationAnswerHairLayer =
  | '원랭스'
  | '로우 레이어드'
  | '미디엄 레이어드'
  | '하이 레이어드';

export type HairConsultationAnswerHairCurl = '스트레이트' | 'J컬' | 'C컬' | 'S컬' | 'SS컬' | 'CS컬';

export type HairConsultationAnswerPriceType = 'RANGE' | 'SINGLE';

export type CreateHairConsultationAnswerRequest = {
  faceShape?: HairConsultationAnswerFaceShape;
  isFaceShapeAdvice?: boolean;

  bangsTypes?: string[];
  isBangsTypeAdvice?: boolean;

  hairLengths?: HairConsultationAnswerHairLength[];
  isHairLengthAdvice?: boolean;

  hairLayers?: HairConsultationAnswerHairLayer[];
  isHairLayerAdvice?: boolean;

  hairCurls?: HairConsultationAnswerHairCurl[];
  isHairCurlAdvice?: boolean;

  title: string;
  styleImages?: string[];

  priceType: HairConsultationAnswerPriceType;
  minPrice?: number;
  maxPrice?: number;
  price?: number;

  description?: string;
};
