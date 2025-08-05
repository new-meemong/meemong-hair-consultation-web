export const BANG_STYLE = {
  COVERED_FOREHEAD: 'coveredForehead',
  EXPOSED_FOREHEAD: 'exposedForehead',
  NO_BANGS: 'noBangs',
  SIDE_SWEPT_BANGS: 'sideSweptBangs',
  STRAIGHT_BANGS: 'straightBangs',
  ALL: 'all',
} as const;

export const BANG_STYLE_OPTION = {
  [BANG_STYLE.COVERED_FOREHEAD]: {
    label: '이마를 가리는 스타일',
    value: BANG_STYLE.COVERED_FOREHEAD,
    result: '이마를 가리는 스타일이 잘 어울려요',
  },
  [BANG_STYLE.EXPOSED_FOREHEAD]: {
    label: '이마가 보이는 스타일',
    value: BANG_STYLE.EXPOSED_FOREHEAD,
    result: '이마가 보이는 스타일이 잘 어울려요',
  },
  [BANG_STYLE.ALL]: {
    label: '모두 다 잘 어울려요',
    value: BANG_STYLE.ALL,
    result: '모두 다 잘 어울려요',
  },
  [BANG_STYLE.NO_BANGS]: {
    label: '앞머리 없는 스타일',
    value: BANG_STYLE.NO_BANGS,
    result: '앞머리 없는 스타일이 잘 어울려요',
  },
  [BANG_STYLE.SIDE_SWEPT_BANGS]: {
    label: '앞머리 넘기는 스타일',
    value: BANG_STYLE.SIDE_SWEPT_BANGS,
    result: '앞머리 넘기는 스타일이 잘 어울려요',
  },
  [BANG_STYLE.STRAIGHT_BANGS]: {
    label: '앞머리 내리는 스타일',
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
