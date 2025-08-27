import { useFormContext, useWatch } from 'react-hook-form';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';
import ConsultingHairCondition from '../../consulting-hair-condition';

import ConsultingResponseFormOptionNeedConsultation from './consulting-response-form-option-need-consultation';

export default function ConsultingResponseFormStepDamageLevel() {
  const { control, setValue } = useFormContext<ConsultingResponseFormValues>();

  const formValue = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.DAMAGE_LEVEL,
  });

  const needStoreConsulting = formValue.needStoreConsulting;

  const handleNeedStoreConsultingChange = () => {
    setValue(
      CONSULTING_RESPONSE_FORM_FIELD_NAME.DAMAGE_LEVEL,
      {
        value: needStoreConsulting ? 1 : null,
        needStoreConsulting: !needStoreConsulting,
      },
      {
        shouldDirty: true,
      },
    );
  };

  const handleProgressChange = (value: number) => {
    setValue(
      CONSULTING_RESPONSE_FORM_FIELD_NAME.DAMAGE_LEVEL,
      { value, needStoreConsulting },
      {
        shouldDirty: true,
      },
    );
  };

  if (formValue === undefined) return null;

  return (
    <div className="flex flex-col gap-7">
      <ConsultingHairCondition value={formValue.value} onChange={handleProgressChange} />
      <ConsultingResponseFormOptionNeedConsultation
        value={needStoreConsulting}
        onChange={handleNeedStoreConsultingChange}
      />
    </div>
  );
}
