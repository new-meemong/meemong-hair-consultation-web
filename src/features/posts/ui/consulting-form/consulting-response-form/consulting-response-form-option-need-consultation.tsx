import Checkbox from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';

type ConsultingResponseFormOptionNeedConsultationProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function ConsultingResponseFormOptionNeedConsultation({
  value,
  onChange,
}: ConsultingResponseFormOptionNeedConsultationProps) {
  return (
    <div className="flex gap-2 items-center justify-end">
      <Label htmlFor="no-operation" className="typo-body-3-regular text-label-sub">
        매장 상담이 필요해요
      </Label>
      <Checkbox id="no-operation" shape="round" checked={value} onChange={() => onChange(!value)} />
    </div>
  );
}
