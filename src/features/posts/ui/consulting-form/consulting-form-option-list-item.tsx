import Checkbox from '@/shared/ui/checkbox';

import { Label } from '@/shared';

import type { ConsultingFormOption } from '../../types/consulting-form-option';

type ConsultingFormOptionListItemProps = {
  option: ConsultingFormOption;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export default function ConsultingFormOptionListItem({
  option,
  checked,
  onCheckedChange,
}: ConsultingFormOptionListItemProps) {
  const { label, additional, value } = option;

  return (
    <div className="flex flex-col gap-7">
      <div className="flex gap-4 items-center px-4 py-3.5 border-border-default border-1 rounded-4">
        <Checkbox
          id={value}
          shape="round"
          checked={checked}
          onChange={() => onCheckedChange(!checked)}
        />
        <Label htmlFor={value} className="flex-1 typo-body-2-long-medium text-label-sub">
          {label}
        </Label>
      </div>
      {additional && checked && <div>{additional}</div>}
    </div>
  );
}
