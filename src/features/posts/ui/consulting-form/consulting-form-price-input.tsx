import { Input } from '@/shared';

type ConsultingFormPriceInputProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
};
export default function ConsultingFormPriceInput({
  name,
  value,
  onChange,
  label,
}: ConsultingFormPriceInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = value;
    onChange(e);
  };

  const displayValue = value ? Number(value).toLocaleString() : '';

  return (
    <div className="flex gap-4 items-center">
      <div className="px-4 py-1.5 typo-body-2-long-medium text-label-info bg-alternative rounded-6 whitespace-nowrap">
        {label}
      </div>
      <div className="flex gap-2 typo-body-2-regular flex-1 items-center">
        <div className="border-b-1 border-border-strong flex-1">
          <Input
            name={name}
            value={displayValue}
            onChange={handleChange}
            placeholder="금액을 숫자로 입력해주세요"
            className="h-9"
          />
        </div>
        <span className="text-label-info">원</span>
      </div>
    </div>
  );
}
