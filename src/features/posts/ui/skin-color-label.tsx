import type { ValueOf } from '@/shared/type/types';

export const SKIN_COLOR_TYPE = {
  VERY_BRIGHT: 'veryBright',
  BRIGHT: 'bright',
  NORMAL: 'normal',
  DARK: 'dark',
  VERY_DARK: 'veryDark',
} as const;

export const SKIN_COLOR_OPTION = {
  [SKIN_COLOR_TYPE.VERY_BRIGHT]: {
    label: '매우 밝음',
    value: SKIN_COLOR_TYPE.VERY_BRIGHT,
    color: '#FFFCFB',
  },
  [SKIN_COLOR_TYPE.BRIGHT]: {
    label: '밝음',
    value: SKIN_COLOR_TYPE.BRIGHT,
    color: '#FFF6F1',
  },
  [SKIN_COLOR_TYPE.NORMAL]: {
    label: '보통',
    value: SKIN_COLOR_TYPE.NORMAL,
    color: '#FDF0E9',
  },
  [SKIN_COLOR_TYPE.DARK]: {
    label: '어두움',
    value: SKIN_COLOR_TYPE.DARK,
    color: '#EFDDD4',
  },
  [SKIN_COLOR_TYPE.VERY_DARK]: {
    label: '매우 어두움',
    value: SKIN_COLOR_TYPE.VERY_DARK,
    color: '#EAD3C8',
  },
} as const;

type SkinColorLabelProps = {
  type: ValueOf<typeof SKIN_COLOR_TYPE>;
};

export default function SkinColorLabel({ type }: SkinColorLabelProps) {
  const { label, color } = SKIN_COLOR_OPTION[type];

  return (
    <div className="flex gap-3 items-center">
      <div
        className="w-6 h-6 border-1 border-border-strong rounded-2"
        style={{ backgroundColor: color }}
      />
      <p>{label}</p>
    </div>
  );
}
