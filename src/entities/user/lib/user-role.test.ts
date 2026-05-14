import { describe, expect, it } from 'vitest';

import { USER_ROLE } from '../constants/user-role';

import { getUserRole, isDesigner, isModel, normalizeUserRole } from './user-role';

describe('user-role', () => {
  it('role 필드가 있으면 유저 역할을 판정한다', () => {
    expect(getUserRole({ role: USER_ROLE.DESIGNER })).toBe(USER_ROLE.DESIGNER);
    expect(isDesigner({ role: USER_ROLE.DESIGNER })).toBe(true);
    expect(isModel({ role: USER_ROLE.DESIGNER })).toBe(false);
  });

  it('Role 필드만 있어도 유저 역할을 판정한다', () => {
    expect(getUserRole({ Role: USER_ROLE.DESIGNER })).toBe(USER_ROLE.DESIGNER);
    expect(isDesigner({ Role: USER_ROLE.DESIGNER })).toBe(true);
    expect(isModel({ Role: USER_ROLE.DESIGNER })).toBe(false);
  });

  it('role과 Role이 모두 있으면 role을 우선한다', () => {
    expect(getUserRole({ role: USER_ROLE.MODEL, Role: USER_ROLE.DESIGNER })).toBe(
      USER_ROLE.MODEL,
    );
  });

  it('role이 null이면 Role로 fallback한다', () => {
    expect(getUserRole({ role: null, Role: USER_ROLE.DESIGNER })).toBe(USER_ROLE.DESIGNER);
  });

  it('role과 Role이 모두 없으면 undefined를 반환한다', () => {
    expect(getUserRole({})).toBeUndefined();
  });

  it('normalizeUserRole은 Role 필드를 제거하고 role로 정규화한다', () => {
    const normalized = normalizeUserRole({
      userId: 1,
      role: null,
      Role: USER_ROLE.DESIGNER,
    });

    expect(normalized).toEqual({ userId: 1, role: USER_ROLE.DESIGNER });
    expect('Role' in normalized).toBe(false);
  });
});
