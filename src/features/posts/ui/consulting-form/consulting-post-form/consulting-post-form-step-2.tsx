import { useFormContext, useWatch } from 'react-hook-form';

import { format } from 'date-fns';

import { CONSULTING_POST_FORM_FIELD_NAME } from '../../../constants/consulting-post-form-field-name';
import type { ConsultingPostFormValues } from '../../../types/consulting-post-form-values';
import ConsultingInputResultListItem from '../../consulting-input-result-list-item';

import ConsultingPostFormOperationForm from './consulting-post-form-operation-form';

export default function ConsultingPostFormStep2() {
  const { control, setValue } = useFormContext<ConsultingPostFormValues>();
  const operations = useWatch({
    control,
    name: CONSULTING_POST_FORM_FIELD_NAME.option2,
  });

  const handleDelete = (index: number) => {
    if (!operations) return;

    setValue(
      CONSULTING_POST_FORM_FIELD_NAME.option2,
      operations.filter((_, i) => i !== index),
      {
        shouldDirty: true,
      },
    );
  };

  return (
    <div className="flex flex-col gap-7">
      <ConsultingPostFormOperationForm />
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
