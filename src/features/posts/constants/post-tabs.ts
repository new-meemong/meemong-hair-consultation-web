import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import type { Option } from '@/shared/type/option';
import { USER_ROLE } from '@/entities/user/constants/user-role';
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

/**
 * 사용자 역할에 따라 적절한 탭 옵션을 반환합니다.
 * 모델: '체험단 협찬신청'
 * 디자이너: '체험단 찾기'
 */
export function getPostTabs(
  role?: ValueOf<typeof USER_ROLE>,
): Option<ValueOf<typeof CONSULT_TYPE>>[] {
  return POST_TABS.map((tab) => {
    if (tab.value === CONSULT_TYPE.EXPERIENCE_GROUP) {
      return {
        ...tab,
        label: role === USER_ROLE.DESIGNER ? '체험단 찾기' : '체험단 협찬신청',
      };
    }
    return tab;
  });
}
