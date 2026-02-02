import { useFormContext, useWatch } from 'react-hook-form';

import ConsultingInputResultListItem from '../consulting-input-result-list-item';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '../../constants/hair-consultation-form-field-name';
import HairConsultationFormOperationForm from './hair-consultation-form-operation-form';
import type { HairConsultationFormValues } from '../../types/hair-consultation-form-values';
import { format } from 'date-fns';

export default function HairConsultationFormStepTreatments() {
  const { control, setValue } = useFormContext<HairConsultationFormValues>();
  const operations = useWatch({
    control,
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENTS,
  });

  const handleDelete = (index: number) => {
    if (!operations) return;

    setValue(
      HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENTS,
      operations.filter((_, i) => i !== index),
      {
        shouldDirty: true,
      },
    );
  };

  return (
    <div className="flex flex-col gap-7">
      <HairConsultationFormOperationForm />
      {operations && (
        <div className="flex flex-col gap-2">
          {operations.map((operation, index) => (
            <ConsultingInputResultListItem
              key={`${operation.name}-${operation.date}-${index}`}
              name={operation.name}
              description={format(operation.date, 'yyyy.MM')}
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
