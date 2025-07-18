import type { TabOption } from '@/shared/type/tab-option';
import type { KeyOf } from '@/shared/type/types';

export const POST_TAB_VALUES = {
  consulting: 'consulting',
  general: 'general',
} as const;

const POST_TAB: Record<KeyOf<typeof POST_TAB_VALUES>, TabOption<KeyOf<typeof POST_TAB_VALUES>>> = {
  consulting: {
    name: '헤어 컨설팅',
    value: POST_TAB_VALUES.consulting,
  },
  general: {
    name: '일반 상담',
    value: POST_TAB_VALUES.general,
  },
};

export const POST_TABS = Object.values(POST_TAB);
