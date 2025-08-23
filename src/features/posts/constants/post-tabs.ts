import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import type { Option } from '@/shared/type/option';
import type { ValueOf } from '@/shared/type/types';

const POST_TAB: Record<ValueOf<typeof CONSULT_TYPE>, Option<ValueOf<typeof CONSULT_TYPE>>> = {
  [CONSULT_TYPE.CONSULTING]: {
    label: '헤어 컨설팅',
    value: CONSULT_TYPE.CONSULTING,
  },
  [CONSULT_TYPE.GENERAL]: {
    label: '일반 상담',
    value: CONSULT_TYPE.GENERAL,
  },
};

export const POST_TABS = Object.values(POST_TAB);
