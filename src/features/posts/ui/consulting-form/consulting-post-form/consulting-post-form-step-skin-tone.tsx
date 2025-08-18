import { SKIN_TONE_OPTION_VALUE } from '@/features/posts/constants/skin-tone';

import { CONSULTING_POST_FORM_FIELD_NAME } from '../../../constants/consulting-post-form-field-name';
import type { ConsultingFormOption } from '../../../types/consulting-form-option';
import SkinColorLabel from '../../skin-color-label';
import ConsultingFormOptionList from '../consulting-form-option-list';

const SKIN_COLOR_OPTIONS: ConsultingFormOption[] = Object.values(SKIN_TONE_OPTION_VALUE).map(
  (option) => ({
    label: <SkinColorLabel type={option} />,
    value: option,
  }),
);

export default function ConsultingPostFormStepSkinTone() {
  return (
    <ConsultingFormOptionList
      options={SKIN_COLOR_OPTIONS}
      name={`${CONSULTING_POST_FORM_FIELD_NAME.SKIN_TONE}`}
      canReset
    />
  );
}
