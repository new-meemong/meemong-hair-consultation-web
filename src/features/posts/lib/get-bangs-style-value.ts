import type { ValueOf } from '@/shared/type/types';

import { BANG_STYLE, BANG_STYLE_LABEL } from '../constants/bang-style';

export default function getBangsStyleValue(
  bangsStyleLabel: ValueOf<typeof BANG_STYLE_LABEL> | null,
) {
  if (!bangsStyleLabel) return null;

  const value = Object.entries(BANG_STYLE_LABEL).find(
    ([, label]) => label === bangsStyleLabel,
  )?.[0];

  return value ? (value as ValueOf<typeof BANG_STYLE>) : null;
}
