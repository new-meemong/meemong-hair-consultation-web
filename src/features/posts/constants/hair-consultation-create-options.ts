import type {
  HairConsultationConcern,
  HairConsultationHairLength,
  HairConsultationHairTexture,
  HairConsultationPersonalColor,
  HairConsultationSkinBrightness,
} from '@/entities/posts/api/create-hair-consultation-request';

import type { ConsultingFormOption } from '../types/consulting-form-option';

export const HAIR_CONSULTATION_HAIR_LENGTH_VALUES = [
  '크롭',
  '숏',
  '미디엄',
  '미디엄롱',
  '롱',
  '장발',
  '숏컷',
  '단발',
  '중단발',
 ] as const satisfies readonly HairConsultationHairLength[];

export const HAIR_CONSULTATION_HAIR_LENGTH_OPTIONS: ConsultingFormOption[] =
  HAIR_CONSULTATION_HAIR_LENGTH_VALUES.map(
    (value) => ({ label: value, value } as const satisfies ConsultingFormOption),
  );

export const HAIR_CONSULTATION_HAIR_TEXTURE_VALUES = [
  '강한 직모',
  '직모',
  '반곱슬',
  '곱슬',
  '강한 곱슬',
 ] as const satisfies readonly HairConsultationHairTexture[];

export const HAIR_CONSULTATION_HAIR_TEXTURE_OPTIONS: ConsultingFormOption[] =
  HAIR_CONSULTATION_HAIR_TEXTURE_VALUES.map(
    (value) => ({ label: value, value } as const satisfies ConsultingFormOption),
  );

export const HAIR_CONSULTATION_SKIN_BRIGHTNESS_VALUES = [
  '매우 밝은/하얀 피부',
  '밝은 피부',
  '보통 피부',
  '까만 피부',
  '매우 어두운/까만 피부',
  '18호 이하',
  '19~21호',
  '22~23호',
  '24~25호',
  '26호 이상',
 ] as const satisfies readonly HairConsultationSkinBrightness[];

export const HAIR_CONSULTATION_SKIN_BRIGHTNESS_OPTIONS: ConsultingFormOption[] =
  HAIR_CONSULTATION_SKIN_BRIGHTNESS_VALUES.map(
    (value) => ({ label: value, value } as const satisfies ConsultingFormOption),
  );

export const HAIR_CONSULTATION_PERSONAL_COLOR_VALUES = [
  '잘모름',
  '봄웜,봄라이트',
  '봄웜,봄브라이트',
  '봄웜,상세분류모름',
  '여름쿨,여름라이트',
  '여름쿨,여름뮤트',
  '여름쿨,상세분류모름',
  '가을웜,가을뮤트',
  '가을웜,가을딥',
  '가을웜,상세분류모름',
  '겨울쿨,겨울브라이트',
  '겨울쿨,겨울딥',
  '겨울쿨,상세분류모름',
 ] as const satisfies readonly HairConsultationPersonalColor[];

export const HAIR_CONSULTATION_PERSONAL_COLOR_OPTIONS: ConsultingFormOption[] =
  HAIR_CONSULTATION_PERSONAL_COLOR_VALUES.map(
    (value) => ({ label: value, value } as const satisfies ConsultingFormOption),
  );

export const HAIR_CONSULTATION_CONCERN_OPTIONS = [
  '어울리는 스타일',
  '어울리는 컬러',
  '탈모',
  '적은 숱',
  '얇은 모발',
  '볼륨 부족',
  '스타일링 어려움',
  '펌이 금방풀림',
  '심한 곱슬',
  '심한 직모',
  '모발손상',
  '지성두피',
  '건조한 두피',
  '특별한 문제는 없어요',
] as const satisfies readonly HairConsultationConcern[];

export type HairConsultationHairLengthOption = HairConsultationHairLength;
export type HairConsultationHairTextureOption = HairConsultationHairTexture;
export type HairConsultationSkinBrightnessOption = HairConsultationSkinBrightness;
export type HairConsultationPersonalColorOption = HairConsultationPersonalColor;
