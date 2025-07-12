import { USER_ROLE } from '@/entities/user/constants/user-role';
import type { ValueOf } from '@/shared/type/types';
import { POST_TABS } from '../constants/post-tabs';

export function getPostTabs(role: ValueOf<typeof USER_ROLE>) {
  switch (role) {
    case USER_ROLE.MODEL:
      return POST_TABS;
    case USER_ROLE.DESIGNER:
      return POST_TABS.filter((tab) => tab.id !== 'my');
    default:
      return [];
  }
}
