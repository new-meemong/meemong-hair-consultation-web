import { useFormContext, useWatch } from 'react-hook-form';
import ConsultingResponseFormPriceForm from './consulting-response-form-price-form';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../types/consulting-response-form-values';
import ConsultingFormInputResultListItem from '../consulting-form-input-result-list-item';

export default function ConsultingResponseFormStep6() {
  const { control, setValue } = useFormContext<ConsultingResponseFormValues>();

  const prices = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option6,
  });

  const handleDelete = (index: number) => {
    if (!prices) return;

    setValue(
      CONSULTING_RESPONSE_FORM_FIELD_NAME.option6,
      prices.filter((_, i) => i !== index),
      {
        shouldDirty: true,
      },
    );
  };

  return (
    <div className="flex flex-col gap-7">
      <ConsultingResponseFormPriceForm />
      {prices && (
        <div className="flex flex-col gap-2">
          {prices.map((price, index) => (
            <ConsultingFormInputResultListItem
              key={`${price.operationName}-${price.minPrice}-${price.maxPrice}-${index}`}
              name={price.operationName}
              description={`${price.minPrice.toLocaleString()}원~${price.maxPrice.toLocaleString()}원`}
              onDelete={() => {
                handleDelete(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
