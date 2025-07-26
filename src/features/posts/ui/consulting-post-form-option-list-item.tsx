import { Checkbox } from '@/shared';
import type { ConsultingPostFormOption } from '../types/consulting-post-form-option';

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
  const { label, additional } = option;

  return (
    <div className="flex flex-col gap-7">
      <div className="rounded-4 bg-alternative">
        <div className="flex gap-4 items-center px-4 py-3">
          <Checkbox shape="round" checked={checked} onCheckedChange={onCheckedChange} />
          <p className="flex-1 typo-body-2-long-regular text-label-sub">{label}</p>
        </div>
      </div>
      {additional && checked && <div>{additional}</div>}
    </div>
  );
}
