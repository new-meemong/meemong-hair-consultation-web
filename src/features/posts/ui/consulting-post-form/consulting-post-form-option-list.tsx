import { useFormContext, useWatch } from 'react-hook-form';
import type { ConsultingPostFormOption } from '../../types/consulting-post-form-option';
import ConsultingPostFormOptionListItem from './consulting-post-form-option-list-item';

type ConsultingPostFormOptionListProps = {
  options: ConsultingPostFormOption[];
  name: string;
};

export default function ConsultingPostFormOptionList({
  options,
  name,
}: ConsultingPostFormOptionListProps) {
  const { control, setValue } = useFormContext();
  const selectedOption = useWatch({ control, name });

  const handleCheckedChange = (value: string) => {
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
