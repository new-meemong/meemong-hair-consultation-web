import type { Option } from '@/shared/type/option';
import type { ValueOf } from '@/shared/type/types';

export const POST_TAB_VALUES = {
  CONSULTING: 'consulting',
  GENERAL: 'general',
} as const;

const POST_TAB: Record<ValueOf<typeof POST_TAB_VALUES>, Option<ValueOf<typeof POST_TAB_VALUES>>> = {
  [POST_TAB_VALUES.CONSULTING]: {
    label: '헤어 컨설팅',
    value: POST_TAB_VALUES.CONSULTING,
  },
  [POST_TAB_VALUES.GENERAL]: {
    label: '일반 상담',
    value: POST_TAB_VALUES.GENERAL,
  },
};

export const POST_TABS = [POST_TAB[POST_TAB_VALUES.GENERAL], POST_TAB[POST_TAB_VALUES.CONSULTING]];
