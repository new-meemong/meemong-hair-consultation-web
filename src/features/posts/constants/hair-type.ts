export const HAIR_TYPE = {
  MALIGNANT_CURLY: 'malignantCurly',
  CURLY: 'curly',
  SEMI_CURLY: 'semiCurly',
  STRAIGHT: 'straight',
} as const;

export const HAIR_TYPE_OPTION = {
  [HAIR_TYPE.MALIGNANT_CURLY]: {
    label: '악성곱슬',
    value: HAIR_TYPE.MALIGNANT_CURLY,
  },
  [HAIR_TYPE.CURLY]: {
    label: '곱슬',
    value: HAIR_TYPE.CURLY,
  },
  [HAIR_TYPE.SEMI_CURLY]: {
    label: '반곱슬',
    value: HAIR_TYPE.SEMI_CURLY,
  },
  [HAIR_TYPE.STRAIGHT]: {
    label: '직모',
    value: HAIR_TYPE.STRAIGHT,
  },
} as const;

export const HAIR_TYPE_OPTIONS = Object.values(HAIR_TYPE_OPTION);
