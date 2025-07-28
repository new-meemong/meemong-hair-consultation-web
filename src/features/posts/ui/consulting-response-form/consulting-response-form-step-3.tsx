import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../constants/consulting-response-form-field-name';
import type { ConsultingFormOption } from '../../types/consulting-form-option';
import ConsultingFormOptionList from '../consulting-form-option-list';

const HAIR_TYPE = {
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
  return (
    <ConsultingFormOptionList
      options={HAIR_TYPE_OPTIONS}
      name={CONSULTING_RESPONSE_FORM_FIELD_NAME.option3}
    />
  );
}
