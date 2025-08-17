export const SKIN_TONE_OPTION_VALUE = {
  VERY_BRIGHT: 'veryBright',
  BRIGHT: 'bright',
  NORMAL: 'normal',
  DARK: 'dark',
  VERY_DARK: 'veryDark',
} as const;

export const SKIN_TONE_OPTION = {
  [SKIN_TONE_OPTION_VALUE.VERY_BRIGHT]: {
    label: '매우 밝음',
    value: SKIN_TONE_OPTION_VALUE.VERY_BRIGHT,
    color: '#FFFCFB',
  },
  [SKIN_TONE_OPTION_VALUE.BRIGHT]: {
    label: '밝음',
    value: SKIN_TONE_OPTION_VALUE.BRIGHT,
    color: '#FFF6F1',
  },
  [SKIN_TONE_OPTION_VALUE.NORMAL]: {
    label: '보통',
    value: SKIN_TONE_OPTION_VALUE.NORMAL,
    color: '#FDF0E9',
  },
  [SKIN_TONE_OPTION_VALUE.DARK]: {
    label: '어두움',
    value: SKIN_TONE_OPTION_VALUE.DARK,
    color: '#EFDDD4',
  },
  [SKIN_TONE_OPTION_VALUE.VERY_DARK]: {
    label: '매우 어두움',
    value: SKIN_TONE_OPTION_VALUE.VERY_DARK,
    color: '#EAD3C8',
  },
} as const;
