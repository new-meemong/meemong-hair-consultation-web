import { Checkbox, Label } from '@/shared';
import type { ConsultingPostFormOption } from '../../types/consulting-post-form-option';

type ConsultingPostFormOptionListItemProps = {
  option: ConsultingPostFormOption;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export default function ConsultingPostFormOptionListItem({
  option,
  checked,
  onCheckedChange,
}: ConsultingPostFormOptionListItemProps) {
  const { label, additional, value } = option;

  return (
    <div className="flex flex-col gap-7">
      <div className="rounded-4 bg-alternative">
        <div className="flex gap-4 items-center px-4 py-3">
          <Checkbox id={value} shape="round" checked={checked} onCheckedChange={onCheckedChange} />
          <Label htmlFor={value} className="flex-1 typo-body-2-long-regular text-label-sub">
            {label}
          </Label>
        </div>
      </div>
      {additional && checked && <div>{additional}</div>}
    </div>
  );
}
