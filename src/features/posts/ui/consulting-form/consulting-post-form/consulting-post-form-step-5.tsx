import { CONSULTING_POST_FORM_FIELD_NAME } from '../../../constants/consulting-post-form-field-name';
import type { ConsultingFormOption } from '../../../types/consulting-form-option';
import SkinColorLabel, { SKIN_COLOR_OPTION } from '../../skin-color-label';
import ConsultingFormOptionList from '../consulting-form-option-list';

const SKIN_COLOR_OPTIONS: ConsultingFormOption[] = Object.values(SKIN_COLOR_OPTION).map(
  (option) => ({
    label: <SkinColorLabel type={option.value} />,
    value: option.value,
  }),
);

export default function ConsultingPostFormStep5() {
  return (
    <ConsultingFormOptionList
      options={SKIN_COLOR_OPTIONS}
      name={`${CONSULTING_POST_FORM_FIELD_NAME.option5}`}
      canReset
    />
  );
}
