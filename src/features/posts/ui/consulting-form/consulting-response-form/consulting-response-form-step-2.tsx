import { HAIR_TYPE_OPTIONS } from '@/features/posts/constants/hair-type';
import { useFormContext, useWatch } from 'react-hook-form';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';
import ConsultingFormOptionList from '../consulting-form-option-list';
import ConsultingResponseFormOptionNeedConsultation from './consulting-response-form-option-need-consultation';

export default function ConsultingResponseFormStep2() {
  const { control, setValue } = useFormContext<ConsultingResponseFormValues>();

  const formValue = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option2,
  });

  const needStoreConsulting = formValue === null;

  const handleNeedStoreConsultingChange = () => {
    setValue(CONSULTING_RESPONSE_FORM_FIELD_NAME.option2, needStoreConsulting ? undefined : null, {
      shouldDirty: true,
    });
  };

  return (
    <div className="flex flex-col gap-7">
      <ConsultingFormOptionList
        options={HAIR_TYPE_OPTIONS}
        name={CONSULTING_RESPONSE_FORM_FIELD_NAME.option2}
        canReset={true}
      />
      <ConsultingResponseFormOptionNeedConsultation
        value={needStoreConsulting}
        onChange={handleNeedStoreConsultingChange}
      />
    </div>
  );
}
