import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';

import type { Option } from '@/shared/type/option';
import type { ValueOf } from '@/shared/type/types';

const POST_TAB: Record<ValueOf<typeof CONSULT_TYPE>, Option<ValueOf<typeof CONSULT_TYPE>>> = {
  [CONSULT_TYPE.CONSULTING]: {
    label: '헤어 컨설팅',
    value: CONSULT_TYPE.CONSULTING,
  },
  [CONSULT_TYPE.EXPERIENCE_GROUP]: {
    label: '체험단 협찬신청',
    value: CONSULT_TYPE.EXPERIENCE_GROUP,
  },
};

export const POST_TABS = Object.values(POST_TAB);
