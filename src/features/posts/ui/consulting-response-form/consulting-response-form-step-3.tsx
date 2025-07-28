import { Checkbox, Label } from '@/shared';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../constants/consulting-response-form-field-name';
import type { ConsultingFormOption } from '../../types/consulting-form-option';
import ConsultingFormOptionList from '../consulting-form-option-list';
import { useFormContext, useWatch } from 'react-hook-form';
import type { ConsultingResponseFormValues } from '../../types/consulting-response-form-values';

export const HAIR_TYPE = {
  MALIGNANT_CURLY: 'malignantCurly',
  CURLY: 'curly',
  SEMI_CURLY: 'semiCurly',
  STRAIGHT: 'straight',
} as const;

const HAIR_TYPE_OPTIONS: ConsultingFormOption[] = [
  {
    label: '악성곱슬',
    value: HAIR_TYPE.MALIGNANT_CURLY,
  },
  {
    label: '곱슬',
    value: HAIR_TYPE.CURLY,
  },
  {
    label: '반곱슬',
    value: HAIR_TYPE.SEMI_CURLY,
  },
  {
    label: '직모',
    value: HAIR_TYPE.STRAIGHT,
  },
];

export default function ConsultingResponseFormStep3() {
  const { control, setValue } = useFormContext<ConsultingResponseFormValues>();

  const formValue = useWatch({
    control,
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option3,
  });

  const needStoreConsulting = formValue === null;

  const handleNeedStoreConsultingChange = () => {
    setValue(CONSULTING_RESPONSE_FORM_FIELD_NAME.option3, needStoreConsulting ? undefined : null, {
      shouldDirty: true,
    });
  };

  return (
    <div className="flex flex-col gap-7">
      <ConsultingFormOptionList
        options={HAIR_TYPE_OPTIONS}
        name={CONSULTING_RESPONSE_FORM_FIELD_NAME.option3}
        canReset={true}
      />
      <div className="flex gap-2 items-center justify-end">
        <Label htmlFor="no-operation" className="typo-body-3-regular text-label-sub">
          매장 상담이 필요해요
        </Label>
        <Checkbox
          id="no-operation"
          shape="round"
          checked={needStoreConsulting}
          onCheckedChange={handleNeedStoreConsultingChange}
        />
      </div>
    </div>
  );
}
