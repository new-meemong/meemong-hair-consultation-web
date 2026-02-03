export type HairConsultationConcern =
  | '어울리는 스타일'
  | '어울리는 컬러'
  | '탈모'
  | '적은 숱'
  | '얇은 모발'
  | '볼륨 부족'
  | '스타일링 어려움'
  | '펌이 금방풀림'
  | '심한 곱슬'
  | '심한 직모'
  | '모발손상'
  | '지성두피'
  | '건조한 두피'
  | '특별한 문제는 없어요';

export type HairConsultationHairLength =
  | '크롭'
  | '숏'
  | '미디엄'
  | '미디엄롱'
  | '롱'
  | '장발'
  | '숏컷'
  | '단발'
  | '중단발';

export type HairConsultationSkinBrightness =
  | '매우 밝은/하얀 피부'
  | '밝은 피부'
  | '보통 피부'
  | '까만 피부'
  | '매우 어두운/까만 피부'
  | '18호 이하'
  | '19~21호'
  | '22~23호'
  | '24~25호'
  | '26호 이상';

export type HairConsultationHairTexture = '강한 직모' | '직모' | '반곱슬' | '곱슬' | '강한 곱슬';

export type HairConsultationPersonalColor =
  | '잘모름'
  | '봄웜,봄라이트'
  | '봄웜,봄브라이트'
  | '봄웜,상세분류모름'
  | '여름쿨,여름라이트'
  | '여름쿨,여름뮤트'
  | '여름쿨,상세분류모름'
  | '가을웜,가을뮤트'
  | '가을웜,가을딥'
  | '가을웜,상세분류모름'
  | '겨울쿨,겨울브라이트'
  | '겨울쿨,겨울딥'
  | '겨울쿨,상세분류모름';

export type HairConsultationAspirationImageType =
  | '강렬한,열정적인'
  | '카리스마,도전적인'
  | '단호한,지적인'
  | '날카로운,차가운'
  | '활기찬,발랄한'
  | '밝은,건강한'
  | '단정한,정돈된'
  | '현대적인,깨끗한'
  | '생기있는,상냥한'
  | '편안한,친근한'
  | '자연스러운,은은한'
  | '미니멀한,세련된'
  | '귀여운,순수한'
  | '다정한,포근한'
  | '차분한,조용한'
  | '산뜻한,청량한';

export type HairConsultationDesiredDateType =
  | '협의 가능'
  | '가능한 빨리'
  | '일주일 이내'
  | '특정 날짜 전까지'
  | '원하는 날짜 있음';

export type HairConsultationTreatmentType =
  | '일반펌'
  | '열펌/셋팅펌'
  | '다운펌'
  | '매직'
  | '일반염색'
  | '블랙염색'
  | '탈색'
  | '커트만 했어요'
  | '커트/드라이만 했어요'
  | '블랙빼기'
  | '클리닉'
  | '특수클리닉(신데렐라 등)';

export type HairConsultationTreatmentArea = '전체' | '뿌리' | '투톤' | '앞머리' | '기타';

export type HairConsultationTreatmentRequest = {
  treatmentType: HairConsultationTreatmentType;
  treatmentDate: string;
  isSelf: boolean;
  treatmentArea?: HairConsultationTreatmentArea | null;
  decolorizationCount?: number | null;
};

export type HairConsultationAspirationImageRequest = {
  imageUrl: string;
};

export type HairConsultationMyImageRequest = {
  imageUrl: string;
  subType: 'CURRENT' | 'FRONT' | 'TIED_SIDE' | 'UPPER_BODY';
};

export type CreateHairConsultationRequest = {
  title: string;
  content: string;
  hairConsultTreatmentDescription?: string;
  hairConcerns: HairConsultationConcern[];
  hairLength: HairConsultationHairLength;
  skinBrightness: HairConsultationSkinBrightness;
  hairTexture: HairConsultationHairTexture;
  personalColor: HairConsultationPersonalColor;
  aspirationImageTypes: HairConsultationAspirationImageType[];
  aspirationImageDescription: string;
  desiredDateType?: HairConsultationDesiredDateType;
  desiredDate?: string | null;
  desiredCostPrice: number;
  treatment?: HairConsultationTreatmentRequest[];
  aspirationImages?: HairConsultationAspirationImageRequest[];
  myImages?: HairConsultationMyImageRequest[];
};
