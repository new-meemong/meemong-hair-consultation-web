import { useFormContext, useWatch } from 'react-hook-form';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';
import ConsultingHairCondition from '../../consulting-hair-condition';
import ConsultingResponseFormOptionNeedConsultation from './consulting-response-form-option-need-consultation';

export default function ConsultingResponseFormStep3() {
  const { control, setValue } = useFormContext<ConsultingResponseFormValues>();

  const formValue = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option3,
  });

  const needStoreConsulting = formValue === null;

  const handleNeedStoreConsultingChange = () => {
    setValue(CONSULTING_RESPONSE_FORM_FIELD_NAME.option3, needStoreConsulting ? 1 : null, {
      shouldDirty: true,
    });
  };

  const handleProgressChange = (value: number) => {
    setValue(CONSULTING_RESPONSE_FORM_FIELD_NAME.option3, value, {
      shouldDirty: true,
    });
  };

  if (formValue === undefined) return null;

  return (
    <div className="flex flex-col gap-7">
      <ConsultingHairCondition value={formValue} onChange={handleProgressChange} />
      <ConsultingResponseFormOptionNeedConsultation
        value={needStoreConsulting}
        onChange={handleNeedStoreConsultingChange}
      />
    </div>
  );
}
