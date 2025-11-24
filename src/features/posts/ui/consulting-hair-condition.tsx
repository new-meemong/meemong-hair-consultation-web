import { cn } from '@/lib/utils';
import ProgressSlider from '@/shared/ui/progress-slider';

import { HAIR_CONDITION_OPTION, HAIR_CONDITION_OPTION_VALUES } from '../constants/hair-condition';

type ConsultingHairConditionProps = {
  value: number | null;
  onChange?: (value: number) => void;
};

export default function ConsultingHairCondition({ value, onChange }: ConsultingHairConditionProps) {
  return (
    <div className="flex flex-col gap-7">
      <div
        className={cn(
          'flex items-center justify-center bg-alternative rounded-4 h-11.25 typo-body-1-regular',
          onChange ? 'text-label-info' : 'text-label-sub',
        )}
      >
        {value ? HAIR_CONDITION_OPTION[value].label : ''}
      </div>
      <ProgressSlider
        total={HAIR_CONDITION_OPTION_VALUES.length}
        value={value}
        leftLabel="매우 건강"
        rightLabel="매우 손상"
        onChange={onChange}
      />
    </div>
  );
}
