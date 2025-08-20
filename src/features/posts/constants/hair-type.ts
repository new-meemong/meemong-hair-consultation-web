import type { ValueOf } from '@/shared/type/types';

export const HAIR_TYPE = {
  MALIGNANT_CURLY: 'malignantCurly',
  CURLY: 'curly',
  SEMI_CURLY: 'semiCurly',
  STRAIGHT: 'straight',
} as const;

export const HAIR_TYPE_LABEL = {
  [HAIR_TYPE.MALIGNANT_CURLY]: '악성곱슬',
  [HAIR_TYPE.CURLY]: '곱슬',
  [HAIR_TYPE.SEMI_CURLY]: '반곱슬',
  [HAIR_TYPE.STRAIGHT]: '직모',
} as const;

export const HAIR_TYPE_OPTION: Record<
  ValueOf<typeof HAIR_TYPE>,
  {
    label: ValueOf<typeof HAIR_TYPE_LABEL>;
    value: ValueOf<typeof HAIR_TYPE>;
  }
> = {
  [HAIR_TYPE.MALIGNANT_CURLY]: {
    label: HAIR_TYPE_LABEL[HAIR_TYPE.MALIGNANT_CURLY],
    value: HAIR_TYPE.MALIGNANT_CURLY,
  },
  [HAIR_TYPE.CURLY]: {
    label: HAIR_TYPE_LABEL[HAIR_TYPE.CURLY],
    value: HAIR_TYPE.CURLY,
  },
  [HAIR_TYPE.SEMI_CURLY]: {
    label: HAIR_TYPE_LABEL[HAIR_TYPE.SEMI_CURLY],
    value: HAIR_TYPE.SEMI_CURLY,
  },
  [HAIR_TYPE.STRAIGHT]: {
    label: HAIR_TYPE_LABEL[HAIR_TYPE.STRAIGHT],
    value: HAIR_TYPE.STRAIGHT,
  },
} as const;

export const HAIR_TYPE_OPTIONS = Object.values(HAIR_TYPE_OPTION);
