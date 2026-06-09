import { USER_ROLE } from '@/entities/user/constants/user-role';
import { getUserRole } from '@/entities/user/lib/user-role';
import type { UserData } from '@/shared/lib/auth';

import { analyticsService } from './service';
import type { AnalyticsUserRole, AnalyticsUserTraits, AnalyticsUserType } from './types';

export function normalizeAnalyticsUserRole(value: unknown): AnalyticsUserRole {
  if (value === USER_ROLE.MODEL || value === String(USER_ROLE.MODEL)) {
    return 'model';
  }

  if (value === USER_ROLE.DESIGNER || value === String(USER_ROLE.DESIGNER)) {
    return 'designer';
  }

  if (value === 'model' || value === 'MODEL') {
    return 'model';
  }

  if (value === 'designer' || value === 'DESIGNER') {
    return 'designer';
  }

  return 'unknown';
}

export function analyticsUserTypeForRole(role: AnalyticsUserRole): AnalyticsUserType {
  if (role === 'model') return 'MODEL';
  if (role === 'designer') return 'DESIGNER';
  return 'UNKNOWN';
}

export function analyticsUserTraitsFromUser(user: UserData): Required<AnalyticsUserTraits> {
  const userRole = normalizeAnalyticsUserRole(getUserRole(user));

  return {
    user_id: String(user.id),
    user_role: userRole,
    user_type: analyticsUserTypeForRole(userRole),
  };
}

export function syncAnalyticsAuthenticatedUser(user: UserData): Promise<void> {
  return analyticsService.identify(String(user.id), analyticsUserTraitsFromUser(user));
}
