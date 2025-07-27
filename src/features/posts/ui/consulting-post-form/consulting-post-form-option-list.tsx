import { useFormContext, useWatch } from 'react-hook-form';
import type { ConsultingPostFormOption } from '../../types/consulting-post-form-option';
import ConsultingPostFormOptionListItem from './consulting-post-form-option-list-item';

type ConsultingPostFormOptionListProps = {
  options: ConsultingPostFormOption[];
  name: string;
  canReset?: boolean;
};

export default function ConsultingPostFormOptionList({
  options,
  name,
  canReset = false,
}: ConsultingPostFormOptionListProps) {
  const { control, setValue, getValues } = useFormContext();
  const selectedOption = useWatch({ control, name });

  const handleCheckedChange = (value: string) => {
    if (canReset) {
      const currentValue = getValues(name);
      if (currentValue === value) {
        setValue(name, undefined, { shouldDirty: true });
        return;
      }
    }
    setValue(name, value, { shouldDirty: true });
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <ConsultingPostFormOptionListItem
          key={option.value}
          option={option}
          checked={selectedOption === option.value}
          onCheckedChange={() => handleCheckedChange(option.value)}
        />
      ))}
    </div>
  );
}
