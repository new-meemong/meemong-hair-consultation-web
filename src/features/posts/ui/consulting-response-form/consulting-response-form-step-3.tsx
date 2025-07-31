import ProgressSlider from '@/shared/ui/progress-slider';
import { useFormContext, useWatch } from 'react-hook-form';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../types/consulting-response-form-values';
import type { Option } from '@/shared/type/option';
import ConsultingResponseFormOptionNeedConsultation from './consulting-response-form-option-need-consultation';

const HAIR_CONDITION_OPTION: Record<number, Option<number>> = {
  1: {
    label: '매우 건강',
    value: 1,
  },
  2: {
    label: '건강',
    value: 2,
  },
  3: {
    label: '약간 손상',
    value: 3,
  },
  4: {
    label: '손상',
    value: 4,
  },
  5: {
    label: '심한 손상',
    value: 5,
  },
  6: {
    label: '극심한 손상',
    value: 6,
  },
} as const;

const HAIR_CONDITION_OPTION_VALUES = Object.values(HAIR_CONDITION_OPTION).map(
  (option) => option.value,
);

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
      <ProgressSlider
        total={HAIR_CONDITION_OPTION_VALUES.length}
        value={formValue}
        leftLabel={HAIR_CONDITION_OPTION[1]?.label}
        rightLabel={HAIR_CONDITION_OPTION[6]?.label}
        onChange={handleProgressChange}
      />
      <div className="flex items-center justify-center bg-alternative rounded-4 h-11.25 typo-body-1-regular text-label-info">
        {formValue ? HAIR_CONDITION_OPTION[formValue].label : ''}
      </div>
      <ConsultingResponseFormOptionNeedConsultation
        value={needStoreConsulting}
        onChange={handleNeedStoreConsultingChange}
      />
    </div>
  );
}
