import { useFormContext, useWatch } from 'react-hook-form';

import { CONSULTING_POST_FORM_FIELD_NAME } from '@/features/posts/constants/consulting-post-form-field-name';
import type { ConsultingPostFormValues } from '@/features/posts/types/consulting-post-form-values';

import ConsultingFormPriceInput from '../consulting-form-price-input';

export default function ConsultingPostFormStepPrice() {
  const { control, setValue } = useFormContext<ConsultingPostFormValues>();

  const price = useWatch({
    name: CONSULTING_POST_FORM_FIELD_NAME.PRICE,
    control,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setValue(CONSULTING_POST_FORM_FIELD_NAME.PRICE, {
      ...price,
      [name]: value ? Number(value) : null,
    });
  };

  return (
    <div className="flex flex-col gap-7 mt-3">
      <ConsultingFormPriceInput
        name="minPaymentPrice"
        value={price.minPaymentPrice?.toString() ?? ''}
        onChange={handleChange}
        label="최소"
      />
      <ConsultingFormPriceInput
        name="maxPaymentPrice"
        value={price.maxPaymentPrice?.toString() ?? ''}
        onChange={handleChange}
        label="최대"
        minPrice={price.minPaymentPrice ?? undefined}
      />
    </div>
  );
}
