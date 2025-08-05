import { Button } from '@/shared';
import FormItem from '@/shared/ui/form-item';
import { Input } from '@/shared/ui/input';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';

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
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = value;
    onChange(e);
  };

  const displayValue = value ? Number(value).toLocaleString() : '';

  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="border-b-1 border-border-strong flex-1">
        <Input
          name={name}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="typo-body-2-regular h-9 w-full"
        />
      </div>
      <span className="typo-body-3-medium text-label-default whitespace-nowrap">만원</span>
    </div>
  );
}

export default function ConsultingResponseFormPriceForm() {
  const { setValue, control } = useFormContext<ConsultingResponseFormValues>();

  const prices = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option6,
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
      CONSULTING_RESPONSE_FORM_FIELD_NAME.option6,
      [
        ...(prices ?? []),
        {
          operationName: formValue.operationName,
          minPrice: Number(formValue.minPrice) * 10000,
          maxPrice: Number(formValue.maxPrice) * 10000,
        },
      ],
      {
        shouldDirty: true,
      },
    );

    setFormValue(INITIAL_FORM_VALUE);
  };

  return (
    <div className="flex flex-col gap-5">
      <FormItem hasUnderline label="시술명">
        <Input
          name="operationName"
          value={formValue.operationName}
          onChange={handleChange}
          placeholder="예)전체탈색, 블랙염색 등"
          className="typo-body-2-regular h-9"
        />
      </FormItem>
      <FormItem label="시술 가격">
        <div className="flex items-center gap-4">
          <PriceInput
            name="minPrice"
            value={formValue.minPrice?.toString() ?? ''}
            onChange={handleChange}
            placeholder="최소 가격"
          />
          <span className="typo-body-3-medium text-label-default">~</span>
          <PriceInput
            name="maxPrice"
            value={formValue.maxPrice?.toString() ?? ''}
            onChange={handleChange}
            placeholder="최대 가격"
          />
        </div>
      </FormItem>
      <Button theme="white" onClick={handleSubmit}>
        시술 입력
      </Button>
    </div>
  );
}
