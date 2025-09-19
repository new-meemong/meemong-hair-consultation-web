import type { User } from '@/entities/user/model/user';

import { USER_ROLE } from '../constants/user-role';

export function isModel(user: User): boolean {
  return user.role === USER_ROLE.MODEL || user.Role === USER_ROLE.MODEL;
}

export function isDesigner(user: User): boolean {
  return user.role === USER_ROLE.DESIGNER || user.Role === USER_ROLE.DESIGNER;
}
