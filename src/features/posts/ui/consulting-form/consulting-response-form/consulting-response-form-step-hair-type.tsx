import { useFormContext, useWatch } from 'react-hook-form';

import { HAIR_TYPE_OPTIONS } from '@/features/posts/constants/hair-type';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';
import ConsultingFormOptionList from '../consulting-form-option-list';
import ConsultingResponseFormOptionNeedConsultation from './consulting-response-form-option-need-consultation';

export default function ConsultingResponseFormStepHairType() {
  const { control, setValue } = useFormContext<ConsultingResponseFormValues>();

  const formValue = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_TYPE,
  });

  const needStoreConsulting = formValue.needStoreConsulting;

  const handleNeedStoreConsultingChange = () => {
    setValue(
      CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_TYPE,
      { value: null, needStoreConsulting: !needStoreConsulting },
      {
        shouldDirty: true,
      },
    );
  };

  return (
    <div className="flex flex-col gap-7">
      <ConsultingFormOptionList
        options={HAIR_TYPE_OPTIONS}
        name={`${CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_TYPE}.value`}
      />
      <ConsultingResponseFormOptionNeedConsultation
        value={needStoreConsulting}
        onChange={handleNeedStoreConsultingChange}
        id={CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_TYPE}
      />
    </div>
  );
}
