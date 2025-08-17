export const HAIR_CONCERN_OPTION_VALUE = {
  DESIGN_POSSIBLE: 'designPossible',
  RECOMMEND_STYLE: 'recommendStyle',
  ETC: 'etc',
} as const;

export const HAIR_CONCERN_OPTION = {
  [HAIR_CONCERN_OPTION_VALUE.DESIGN_POSSIBLE]: {
    label: '원하는 스타일이 어울릴지/가능할지 궁금해요',
    value: HAIR_CONCERN_OPTION_VALUE.DESIGN_POSSIBLE,
  },
  [HAIR_CONCERN_OPTION_VALUE.RECOMMEND_STYLE]: {
    label: '어울리는 스타일을 추천 받고 싶어요',
    value: HAIR_CONCERN_OPTION_VALUE.RECOMMEND_STYLE,
  },
  [HAIR_CONCERN_OPTION_VALUE.ETC]: {
    label: '기타',
    value: HAIR_CONCERN_OPTION_VALUE.ETC,
  },
} as const;

export const HAIR_CONCERN_OPTIONS = Object.values(HAIR_CONCERN_OPTION);
