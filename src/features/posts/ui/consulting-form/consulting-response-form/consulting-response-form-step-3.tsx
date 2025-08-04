import ProgressSlider from '@/shared/ui/progress-slider';
import { useFormContext, useWatch } from 'react-hook-form';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';
import ConsultingResponseFormOptionNeedConsultation from './consulting-response-form-option-need-consultation';
import {
  HAIR_CONDITION_OPTION,
  HAIR_CONDITION_OPTION_VALUES,
} from '@/features/posts/constants/hair-condition';
import ConsultingHairCondition from '../../consulting-hair-condition';

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
