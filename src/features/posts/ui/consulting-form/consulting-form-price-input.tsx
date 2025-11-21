import useShowModal from '@/shared/ui/hooks/use-show-modal';

import { Input } from '@/shared';

type ConsultingFormPriceInputProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label: string;
  minPrice?: number;
  hasValid?: boolean;
};
export default function ConsultingFormPriceInput({
  name,
  value,
  onChange,
  onBlur,
  label,
  minPrice,
  hasValid = true,
}: ConsultingFormPriceInputProps) {
  const showModal = useShowModal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replaceAll(',', '');
    const numericValue = inputValue.replace(/[^0-9]/g, '');

    if (inputValue !== numericValue) {
      return;
    }

    e.target.value = numericValue;
    onChange(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const numericValue = Number(value);

    if (hasValid && label === '최소' && numericValue < 10000) {
      showModal({
        id: 'report-form-reason-required',
        text: (
          <p className="typo-body-1-long-regular whitespace-pre-line">
            <span className="typo-body-1-long-semibold">10,000원 이상</span>의<br />
            금액을 입력해주세요.
          </p>
        ),
        buttons: [
          {
            label: '확인',
            onClick: () => {
              e.target.value = '';
              onChange(e);
            },
          },
        ],
      });
    }

    if (hasValid && minPrice && numericValue < minPrice) {
      showModal({
        id: 'report-form-reason-required',
        text: (
          <p className="typo-body-1-long-regular whitespace-pre-line">
            최소 금액보다 <span className="typo-body-1-long-semibold">크거나 같은</span> <br />
            최대 금액을 입력해주세요.
          </p>
        ),
        buttons: [
          {
            label: '확인',
            onClick: () => {
              e.target.value = '';
              onChange(e);
            },
          },
        ],
      });
    }

    onBlur?.(e);
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
            onBlur={handleBlur}
            placeholder="금액을 숫자로 입력해주세요"
            className="h-9"
          />
        </div>
        <span className="text-label-info">원</span>
      </div>
    </div>
  );
}
