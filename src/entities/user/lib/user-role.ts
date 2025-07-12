import { USER_ROLE } from '../constants/user-role';
import type { User } from '../model/user';

export function isModel(user: Pick<User, 'role'>): boolean {
  return user.role === USER_ROLE.MODEL;
}

export function isDesigner(user: Pick<User, 'role'>): boolean {
  return user.role === USER_ROLE.DESIGNER;
}
