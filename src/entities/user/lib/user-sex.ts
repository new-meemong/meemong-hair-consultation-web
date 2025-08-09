import type { ValueOf } from '@/shared/type/types';

import { USER_SEX } from '../constants/user-sex';

export function isUserMale(sex: ValueOf<typeof USER_SEX>): boolean {
  return sex === USER_SEX.MALE;
}

export function isUserFemale(sex: ValueOf<typeof USER_SEX>): boolean {
  return sex === USER_SEX.FEMALE;
}
