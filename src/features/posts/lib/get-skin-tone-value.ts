import type { ValueOf } from '@/shared/type/types';

import { SKIN_TONE_OPTION_LABEL, SKIN_TONE_OPTION_VALUE } from '../constants/skin-tone';

export default function getSkinToneValue(skinToneLabel?: string | null) {
  if (!skinToneLabel) return null;

  return Object.entries(SKIN_TONE_OPTION_LABEL).find(
    ([, label]) => label === skinToneLabel,
  )?.[0] as ValueOf<typeof SKIN_TONE_OPTION_VALUE>;
}
