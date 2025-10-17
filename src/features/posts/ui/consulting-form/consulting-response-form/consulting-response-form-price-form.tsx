import { useState } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';

import { Button } from '@/shared';
import FormItem from '@/shared/ui/form-item';
import { Input } from '@/shared/ui/input';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';

type FormValue = {
  operationName: string;
  minPrice: string | null;
  maxPrice: string | null;
};

const INITIAL_FORM_VALUE: FormValue = {
  operationName: '',
  minPrice: null,
  maxPrice: null,
} as const;

function PriceInput({
  name,
  value,
  onChange,
  label,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}) {
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

export default function ConsultingResponseFormPriceForm() {
  const { setValue, control } = useFormContext<ConsultingResponseFormValues>();

  const prices = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.TREATMENTS,
  });

  const [formValue, setFormValue] = useState<FormValue>(INITIAL_FORM_VALUE);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      formValue.operationName === '' ||
      formValue.minPrice === null ||
      formValue.maxPrice === null
    )
      return;

    setValue(
      CONSULTING_RESPONSE_FORM_FIELD_NAME.TREATMENTS,
      [
        ...(prices ?? []),
        {
          treatmentName: formValue.operationName,
          minPrice: Number(formValue.minPrice),
          maxPrice: Number(formValue.maxPrice),
        },
      ],
      {
        shouldDirty: true,
      },
    );

    setFormValue(INITIAL_FORM_VALUE);
  };

  const canSubmit =
    formValue.operationName !== '' && formValue.minPrice !== null && formValue.maxPrice !== null;

  return (
    <div className="flex flex-col gap-6">
      <FormItem hasUnderline label="시술명">
        <Input
          name="operationName"
          value={formValue.operationName}
          onChange={handleChange}
          placeholder="예)전체탈색, 블랙염색 등"
          className="typo-body-2-regular h-9"
        />
      </FormItem>
      <PriceInput
        name="minPrice"
        value={formValue.minPrice?.toString() ?? ''}
        onChange={handleChange}
        label="최소"
      />
      <PriceInput
        name="maxPrice"
        value={formValue.maxPrice?.toString() ?? ''}
        onChange={handleChange}
        label="최대"
      />
      <Button theme="white" onClick={handleSubmit} disabled={!canSubmit}>
        시술 입력
      </Button>
    </div>
  );
}
