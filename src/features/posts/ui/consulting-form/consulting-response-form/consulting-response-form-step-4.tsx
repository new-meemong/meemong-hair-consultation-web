import { useFormContext, useWatch } from 'react-hook-form';

import { BANG_STYLE_OPTIONS } from '@/features/posts/constants/bang-style';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';
import ConsultingFormOptionList from '../consulting-form-option-list';

import ConsultingResponseFormOptionNeedConsultation from './consulting-response-form-option-need-consultation';

export default function ConsultingResponseFormStep4() {
  const { control, setValue } = useFormContext<ConsultingResponseFormValues>();

  const formValue = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option4,
  });

  const needStoreConsulting = formValue === null;

  const handleNeedStoreConsultingChange = () => {
    setValue(CONSULTING_RESPONSE_FORM_FIELD_NAME.option4, needStoreConsulting ? undefined : null, {
      shouldDirty: true,
    });
  };

  const isMale = false;
  const options = isMale ? BANG_STYLE_OPTIONS.MALE : BANG_STYLE_OPTIONS.FEMALE;

  return (
    <div className="flex flex-col gap-7">
      <ConsultingFormOptionList
        options={options}
        name={CONSULTING_RESPONSE_FORM_FIELD_NAME.option4}
      />
      <ConsultingResponseFormOptionNeedConsultation
        value={needStoreConsulting}
        onChange={handleNeedStoreConsultingChange}
      />
    </div>
  );
}
