import type { TabOption } from '@/shared/type/tab-option';
import type { ValueOf } from '@/shared/type/types';

export const POST_TAB_VALUES = {
  CONSULTING: 'consulting',
  GENERAL: 'general',
} as const;

const POST_TAB: Record<
  ValueOf<typeof POST_TAB_VALUES>,
  TabOption<ValueOf<typeof POST_TAB_VALUES>>
> = {
  [POST_TAB_VALUES.CONSULTING]: {
    name: '헤어 컨설팅',
    value: POST_TAB_VALUES.CONSULTING,
  },
  [POST_TAB_VALUES.GENERAL]: {
    name: '일반 상담',
    value: POST_TAB_VALUES.GENERAL,
  },
};

export const POST_TABS = Object.values(POST_TAB);
