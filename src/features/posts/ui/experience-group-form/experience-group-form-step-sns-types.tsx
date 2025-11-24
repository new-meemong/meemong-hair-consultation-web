import { useFormContext, useWatch } from 'react-hook-form';

import { EXPERIENCE_GROUP_FORM_FIELD_NAME } from '../../constants/experience-group/experience-group-form-field-name';
import type { ExperienceGroupFormValues } from '../../types/experience-group-form-values';
import ConsultingInputResultListItem from '../consulting-input-result-list-item';
import ExperienceGroupFormSnsForm from './experience-group-form-sns-form';

export default function ExperienceGroupFormStepSnsTypes() {
  const { control, setValue } = useFormContext<ExperienceGroupFormValues>();

  const snsTypes = useWatch({
    control,
    name: EXPERIENCE_GROUP_FORM_FIELD_NAME.SNS_TYPES,
  });

  const handleDelete = (index: number) => {
    if (!snsTypes) return;

    setValue(
      EXPERIENCE_GROUP_FORM_FIELD_NAME.SNS_TYPES,
      snsTypes.filter((_, i) => i !== index),
      {
        shouldDirty: true,
      },
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <ExperienceGroupFormSnsForm />
      {snsTypes && (
        <div className="flex flex-col gap-2">
          {snsTypes.map((snsType, index) => (
            <ConsultingInputResultListItem
              key={`${snsType.snsType}-${index}`}
              name={snsType.snsType}
              description={snsType.url}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
