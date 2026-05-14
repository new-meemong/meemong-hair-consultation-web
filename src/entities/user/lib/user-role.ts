import { USER_ROLE } from '../constants/user-role';
import type { ValueOf } from '@/shared/type/types';

export type UserRoleLike = {
  role?: ValueOf<typeof USER_ROLE> | null;
  Role?: ValueOf<typeof USER_ROLE> | null;
};

export type NormalizedUserRole<T extends UserRoleLike> = Omit<T, 'role' | 'Role'> & {
  role?: ValueOf<typeof USER_ROLE>;
};

export function getUserRole(user: UserRoleLike): ValueOf<typeof USER_ROLE> | undefined {
  return user.role ?? user.Role ?? undefined;
}

export function normalizeUserRole<T extends UserRoleLike>(user: T): NormalizedUserRole<T> {
  const { role: _role, Role: _Role, ...rest } = user;
  const normalizedRole = getUserRole(user);

  if (normalizedRole === undefined) {
    return rest;
  }

  return {
    ...rest,
    role: normalizedRole,
  };
}

export function isModel(user: UserRoleLike): boolean {
  return getUserRole(user) === USER_ROLE.MODEL;
}

export function isDesigner(user: UserRoleLike): boolean {
  return getUserRole(user) === USER_ROLE.DESIGNER;
}
