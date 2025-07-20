import { USER_ROLE } from '@/entities/user/constants/user-role';
import type { ValueOf } from '@/shared/type/types';
import { POST_LIST_TABS } from '../constants/post-list-tabs';

export function getPostListTabs(role: ValueOf<typeof USER_ROLE>) {
  switch (role) {
    case USER_ROLE.MODEL:
      return POST_LIST_TABS;
    case USER_ROLE.DESIGNER:
      return POST_LIST_TABS.filter((tab) => tab.id !== 'my');
    default:
      return [];
  }
}
