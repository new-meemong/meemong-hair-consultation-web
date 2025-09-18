import type { Option } from '@/shared/type/option';

export const HAIR_CONDITION_OPTION: Record<number, Option<number>> = {
  1: {
    label: '매우 건강: 모발이 매우 건강해요',
    value: 1,
  },
  2: {
    label: '건강: 모발이 건강해요',
    value: 2,
  },
  3: {
    label: '약간 손상: 시술에 따라 주의가 필요해요',
    value: 3,
  },
  4: {
    label: '손상: 일부 시술이 어려울 수 있어요',
    value: 4,
  },
  5: {
    label: '심한 손상: 대부분의 시술이 어려울 수 있어요',
    value: 5,
  },
  6: {
    label: '극심한 손상: 손상 케어가 필요해요',
    value: 6,
  },
} as const;

export const HAIR_CONDITION_OPTION_VALUES = Object.values(HAIR_CONDITION_OPTION).map(
  (option) => option.value,
);
