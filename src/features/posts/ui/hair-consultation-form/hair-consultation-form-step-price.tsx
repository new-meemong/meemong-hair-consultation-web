import { useFormContext, useWatch } from 'react-hook-form';

import ConsultingFormPriceInput from '../consulting-form/consulting-form-price-input';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '../../constants/hair-consultation-form-field-name';
import type { HairConsultationFormValues } from '../../types/hair-consultation-form-values';

export default function HairConsultationFormStepPrice() {
  const { control, setValue } = useFormContext<HairConsultationFormValues>();

  const price = useWatch({
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.PRICE,
    control,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.PRICE, {
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
