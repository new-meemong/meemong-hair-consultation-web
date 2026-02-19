import type { StaticImageData } from 'next/image';
import type { ValueOf } from '@/shared/type/types';
import hairStyleF1Select from '@/assets/hair-bang-style/hair_style_f1_select.png';
import hairStyleF1Unselect from '@/assets/hair-bang-style/hair_style_f1_unselect.png';
import hairStyleF2Select from '@/assets/hair-bang-style/hair_style_f2_select.png';
import hairStyleF2Unselect from '@/assets/hair-bang-style/hair_style_f2_unselect.png';
import hairStyleF3Select from '@/assets/hair-bang-style/hair_style_f3_select.png';
import hairStyleF3Unselect from '@/assets/hair-bang-style/hair_style_f3_unselect.png';
import hairStyleF4Select from '@/assets/hair-bang-style/hair_style_f4_select.png';
import hairStyleF4Unselect from '@/assets/hair-bang-style/hair_style_f4_unselect.png';
import hairStyleM1Select from '@/assets/hair-bang-style/hair_style_m1_select.png';
import hairStyleM1Unselect from '@/assets/hair-bang-style/hair_style_m1_unselect.png';
import hairStyleM2Select from '@/assets/hair-bang-style/hair_style_m2_select.png';
import hairStyleM2Unselect from '@/assets/hair-bang-style/hair_style_m2_unselect.png';
import hairStyleM3Select from '@/assets/hair-bang-style/hair_style_m3_select.png';
import hairStyleM3Unselect from '@/assets/hair-bang-style/hair_style_m3_unselect.png';
import hairStyleM4Select from '@/assets/hair-bang-style/hair_style_m4_select.png';
import hairStyleM4Unselect from '@/assets/hair-bang-style/hair_style_m4_unselect.png';

export const BANG_STYLE = {
  MALE_COVERED: 'maleCovered',
  MALE_PARTED: 'maleParted',
  MALE_SWEPT_BACK: 'maleSweptBack',
  MALE_UP: 'maleUp',
  FEMALE_NO_BANGS: 'femaleNoBangs',
  FEMALE_SIDE_CURTAIN: 'femaleSideCurtain',
  FEMALE_SEE_THROUGH: 'femaleSeeThrough',
  FEMALE_FULL: 'femaleFull',
  COVERED_FOREHEAD: 'coveredForehead',
  EXPOSED_FOREHEAD: 'exposedForehead',
  NO_BANGS: 'noBangs',
  SIDE_SWEPT_BANGS: 'sideSweptBangs',
  STRAIGHT_BANGS: 'straightBangs',
  ALL: 'all',
} as const;

export const BANG_STYLE_LABEL = {
  [BANG_STYLE.MALE_COVERED]: '덮은 머리',
  [BANG_STYLE.MALE_PARTED]: '가른 머리',
  [BANG_STYLE.MALE_SWEPT_BACK]: '넘긴 머리',
  [BANG_STYLE.MALE_UP]: '올린 머리',
  [BANG_STYLE.FEMALE_NO_BANGS]: '노뱅',
  [BANG_STYLE.FEMALE_SIDE_CURTAIN]: '사이드뱅/커튼뱅',
  [BANG_STYLE.FEMALE_SEE_THROUGH]: '시스루뱅',
  [BANG_STYLE.FEMALE_FULL]: '풀뱅',
  [BANG_STYLE.COVERED_FOREHEAD]: '이마를 가리는 스타일',
  [BANG_STYLE.EXPOSED_FOREHEAD]: '이마가 보이는 스타일',
  [BANG_STYLE.ALL]: '모두 다 잘 어울려요',
  [BANG_STYLE.NO_BANGS]: '앞머리 없는 스타일',
  [BANG_STYLE.SIDE_SWEPT_BANGS]: '앞머리 넘기는 스타일',
  [BANG_STYLE.STRAIGHT_BANGS]: '앞머리 내리는 스타일',
} as const;

export const BANG_STYLE_OPTION: Record<
  ValueOf<typeof BANG_STYLE>,
  {
    label: ValueOf<typeof BANG_STYLE_LABEL>;
    value: ValueOf<typeof BANG_STYLE>;
    result: string;
  }
> = {
  [BANG_STYLE.MALE_COVERED]: {
    label: BANG_STYLE_LABEL[BANG_STYLE.MALE_COVERED],
    value: BANG_STYLE.MALE_COVERED,
    result: '덮은 머리가 잘 어울려요',
  },
  [BANG_STYLE.MALE_PARTED]: {
    label: BANG_STYLE_LABEL[BANG_STYLE.MALE_PARTED],
    value: BANG_STYLE.MALE_PARTED,
    result: '가른 머리가 잘 어울려요',
  },
  [BANG_STYLE.MALE_SWEPT_BACK]: {
    label: BANG_STYLE_LABEL[BANG_STYLE.MALE_SWEPT_BACK],
    value: BANG_STYLE.MALE_SWEPT_BACK,
    result: '넘긴 머리가 잘 어울려요',
  },
  [BANG_STYLE.MALE_UP]: {
    label: BANG_STYLE_LABEL[BANG_STYLE.MALE_UP],
    value: BANG_STYLE.MALE_UP,
    result: '올린 머리가 잘 어울려요',
  },
  [BANG_STYLE.FEMALE_NO_BANGS]: {
    label: BANG_STYLE_LABEL[BANG_STYLE.FEMALE_NO_BANGS],
    value: BANG_STYLE.FEMALE_NO_BANGS,
    result: '노뱅이 잘 어울려요',
  },
  [BANG_STYLE.FEMALE_SIDE_CURTAIN]: {
    label: BANG_STYLE_LABEL[BANG_STYLE.FEMALE_SIDE_CURTAIN],
    value: BANG_STYLE.FEMALE_SIDE_CURTAIN,
    result: '사이드뱅/커튼뱅이 잘 어울려요',
  },
  [BANG_STYLE.FEMALE_SEE_THROUGH]: {
    label: BANG_STYLE_LABEL[BANG_STYLE.FEMALE_SEE_THROUGH],
    value: BANG_STYLE.FEMALE_SEE_THROUGH,
    result: '시스루뱅이 잘 어울려요',
  },
  [BANG_STYLE.FEMALE_FULL]: {
    label: BANG_STYLE_LABEL[BANG_STYLE.FEMALE_FULL],
    value: BANG_STYLE.FEMALE_FULL,
    result: '풀뱅이 잘 어울려요',
  },
  [BANG_STYLE.COVERED_FOREHEAD]: {
    label: BANG_STYLE_LABEL[BANG_STYLE.COVERED_FOREHEAD],
    value: BANG_STYLE.COVERED_FOREHEAD,
    result: '이마를 가리는 스타일이 잘 어울려요',
  },
  [BANG_STYLE.EXPOSED_FOREHEAD]: {
    label: BANG_STYLE_LABEL[BANG_STYLE.EXPOSED_FOREHEAD],
    value: BANG_STYLE.EXPOSED_FOREHEAD,
    result: '이마가 보이는 스타일이 잘 어울려요',
  },
  [BANG_STYLE.ALL]: {
    label: BANG_STYLE_LABEL[BANG_STYLE.ALL],
    value: BANG_STYLE.ALL,
    result: '모두 다 잘 어울려요',
  },
  [BANG_STYLE.NO_BANGS]: {
    label: BANG_STYLE_LABEL[BANG_STYLE.NO_BANGS],
    value: BANG_STYLE.NO_BANGS,
    result: '앞머리 없는 스타일이 잘 어울려요',
  },
  [BANG_STYLE.SIDE_SWEPT_BANGS]: {
    label: BANG_STYLE_LABEL[BANG_STYLE.SIDE_SWEPT_BANGS],
    value: BANG_STYLE.SIDE_SWEPT_BANGS,
    result: '앞머리 넘기는 스타일이 잘 어울려요',
  },
  [BANG_STYLE.STRAIGHT_BANGS]: {
    label: BANG_STYLE_LABEL[BANG_STYLE.STRAIGHT_BANGS],
    value: BANG_STYLE.STRAIGHT_BANGS,
    result: '앞머리 내리는 스타일이 잘 어울려요',
  },
} as const;

export const BANG_STYLE_OPTIONS = {
  MALE: [
    BANG_STYLE_OPTION[BANG_STYLE.COVERED_FOREHEAD],
    BANG_STYLE_OPTION[BANG_STYLE.EXPOSED_FOREHEAD],
    BANG_STYLE_OPTION[BANG_STYLE.ALL],
  ],
  FEMALE: [
    BANG_STYLE_OPTION[BANG_STYLE.NO_BANGS],
    BANG_STYLE_OPTION[BANG_STYLE.SIDE_SWEPT_BANGS],
    BANG_STYLE_OPTION[BANG_STYLE.STRAIGHT_BANGS],
    BANG_STYLE_OPTION[BANG_STYLE.ALL],
  ],
};

export type BangStyleOptionNew = {
  value: ValueOf<typeof BANG_STYLE>;
  title: string;
  description: string;
  selectedImage: StaticImageData;
  unselectedImage: StaticImageData;
};

export const BANG_STYLE_OPTIONS_NEW: {
  MALE: BangStyleOptionNew[];
  FEMALE: BangStyleOptionNew[];
} = {
  MALE: [
    {
      value: BANG_STYLE.MALE_COVERED,
      title: '덮은 머리',
      description: '댄디컷, 쉐도우펌 등',
      selectedImage: hairStyleM1Select,
      unselectedImage: hairStyleM1Unselect,
    },
    {
      value: BANG_STYLE.MALE_PARTED,
      title: '가른 머리',
      description: '애즈펌, 가르마펌 등',
      selectedImage: hairStyleM2Select,
      unselectedImage: hairStyleM2Unselect,
    },
    {
      value: BANG_STYLE.MALE_SWEPT_BACK,
      title: '넘긴 머리',
      description: '가일컷, 드롭컷 등',
      selectedImage: hairStyleM3Select,
      unselectedImage: hairStyleM3Unselect,
    },
    {
      value: BANG_STYLE.MALE_UP,
      title: '올린 머리',
      description: '아이비리스, 슬릭백 등',
      selectedImage: hairStyleM4Select,
      unselectedImage: hairStyleM4Unselect,
    },
  ],
  FEMALE: [
    {
      value: BANG_STYLE.FEMALE_NO_BANGS,
      title: '노뱅',
      description: '앞머리 없음',
      selectedImage: hairStyleF1Select,
      unselectedImage: hairStyleF1Unselect,
    },
    {
      value: BANG_STYLE.FEMALE_SIDE_CURTAIN,
      title: '사이드뱅/커튼뱅',
      description: '앞머리를 옆으로 넘김',
      selectedImage: hairStyleF2Select,
      unselectedImage: hairStyleF2Unselect,
    },
    {
      value: BANG_STYLE.FEMALE_SEE_THROUGH,
      title: '시스루뱅',
      description: '이마가 비치는 앞머리',
      selectedImage: hairStyleF3Select,
      unselectedImage: hairStyleF3Unselect,
    },
    {
      value: BANG_STYLE.FEMALE_FULL,
      title: '풀뱅',
      description: '이마를 꽉 채운 앞머리',
      selectedImage: hairStyleF4Select,
      unselectedImage: hairStyleF4Unselect,
    },
  ],
};
