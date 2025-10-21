import type { ValueOf } from '@/shared/type/types';

import { SKIN_TONE_OPTION, type SKIN_TONE_OPTION_VALUE } from '../constants/skin-tone';

type SkinColorLabelProps = {
  type: ValueOf<typeof SKIN_TONE_OPTION_VALUE>;
};

export default function SkinColorLabel({ type }: SkinColorLabelProps) {
  const { label, color } = SKIN_TONE_OPTION[type];

  return (
    <div className="flex gap-3 items-center">
      <div
        className="w-6 h-6 border-1 border-border-strong rounded-2"
        style={{ backgroundColor: color }}
      />
      <p className="typo-body-2-long-regular text-label-sub">{label}</p>
    </div>
  );
}
