import type { ValueOf } from '@/shared/type/types';

import { HAIR_TYPE, HAIR_TYPE_LABEL } from '../constants/hair-type';

export default function getHairTypeValue(hairTypeLabel?: ValueOf<typeof HAIR_TYPE_LABEL> | null) {
  if (!hairTypeLabel) return null;

  const value = Object.entries(HAIR_TYPE_LABEL).find(([, label]) => label === hairTypeLabel)?.[0];

  return value ? (value as ValueOf<typeof HAIR_TYPE>) : null;
}
