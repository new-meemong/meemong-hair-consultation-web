import Checkbox from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';

type ConsultingResponseFormOptionNeedConsultationProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  id: string;
};

export default function ConsultingResponseFormOptionNeedConsultation({
  value,
  onChange,
  id,
}: ConsultingResponseFormOptionNeedConsultationProps) {
  return (
    <div className="flex gap-2 items-center justify-end">
      <Label htmlFor={id} className="typo-body-3-regular text-label-sub">
        매장 상담이 필요해요
      </Label>
      <Checkbox id={id} shape="round" checked={value} onChange={() => onChange(!value)} />
    </div>
  );
}
