import { HAIR_CONSULTATION_FORM_FIELD_NAME } from './hair-consultation-form-field-name';
import type { HairConsultationFormValues } from '@/features/posts/types/hair-consultation-form-values';
import type { StaticImageData } from 'next/image';
import mHair1 from '@/assets/hair-length/m_hair_1.png';
import mHair2 from '@/assets/hair-length/m_hair_2.png';
import mHair3 from '@/assets/hair-length/m_hair_3.png';
import mHair4 from '@/assets/hair-length/m_hair_4.png';
import mHair5 from '@/assets/hair-length/m_hair_5.png';
import mHair6 from '@/assets/hair-length/m_hair_6.png';
import wHair1 from '@/assets/hair-length/w_hair_1.png';
import wHair2 from '@/assets/hair-length/w_hair_2.png';
import wHair3 from '@/assets/hair-length/w_hair_3.png';
import wHair4 from '@/assets/hair-length/w_hair_4.png';
import wHair5 from '@/assets/hair-length/w_hair_5.png';
import wHair6 from '@/assets/hair-length/w_hair_6.png';

export type HairLengthOption = {
  value: HairConsultationFormValues[typeof HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_LENGTH];
  label: string;
  description: string;
  image: StaticImageData;
};

export const MALE_HAIR_LENGTH_OPTIONS: HairLengthOption[] = [
  { value: '크롭', label: '크롭', description: '3mm ~ 1cm, 반삭 이하', image: mHair1 },
  { value: '숏', label: '숏', description: '세워지는 머리, 가일컷 등', image: mHair2 },
  {
    value: '미디엄',
    label: '미디엄',
    description: '눈썹에 닿는 기장, 댄디컷 등',
    image: mHair3,
  },
  {
    value: '미디엄롱',
    label: '미디엄 롱',
    description: '눈에 닿는 기장, 리프컷 등',
    image: mHair4,
  },
  { value: '롱', label: '롱', description: '광대에 닿는 기장, 울프컷 등', image: mHair5 },
  { value: '장발', label: '장발', description: '어깨에 닿는 기장', image: mHair6 },
];

export const FEMALE_HAIR_LENGTH_OPTIONS: HairLengthOption[] = [
  { value: '숏컷', label: '숏컷', description: '귀 라인 끝보다 짧은 기장', image: wHair1 },
  { value: '단발', label: '단발', description: '귀와 턱 사이 기장', image: wHair2 },
  { value: '중단발', label: '중단발', description: '턱과 어깨 사이 기장', image: wHair3 },
  {
    value: '미디엄',
    label: '미디엄',
    description: '어깨와 쇄골 사이 기장',
    image: wHair4,
  },
  {
    value: '미디엄롱',
    label: '미디엄 롱',
    description: '쇄골과 가슴 사이 기장',
    image: wHair5,
  },
  { value: '장발', label: '장발', description: '가슴 아래보다 긴 기장', image: wHair6 },
];
