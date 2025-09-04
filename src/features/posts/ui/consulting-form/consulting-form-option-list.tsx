import { useFormContext, useWatch } from 'react-hook-form';

import type { ConsultingFormOption } from '../../types/consulting-form-option';

import ConsultingFormOptionListItem from './consulting-form-option-list-item';

type ConsultingFormOptionListProps = {
  options: ConsultingFormOption[];
  name: string;
  canReset?: boolean;
};

export default function ConsultingFormOptionList({
  options,
  name,
  canReset = false,
}: ConsultingFormOptionListProps) {
  const { control, setValue, getValues } = useFormContext();
  const selectedOption = useWatch({ control, name });

  const handleCheckedChange = (value: string) => {
    if (canReset) {
      const currentValue = getValues(name);
      if (currentValue === value) {
        setValue(name, null, { shouldDirty: true });
        return;
      }
    }
    setValue(name, value, { shouldDirty: true });
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <ConsultingFormOptionListItem
          key={option.value}
          option={option}
          checked={selectedOption === option.value}
          onCheckedChange={() => handleCheckedChange(option.value)}
        />
      ))}
    </div>
  );
}
