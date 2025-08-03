import { CONSULTING_POST_FORM_FIELD_NAME } from '../../../constants/consulting-post-form-field-name';
import type { ConsultingFormOption } from '../../../types/consulting-form-option';
import ConsultingFormOptionList from '../consulting-form-option-list';

const SKIN_COLOR = {
  VERY_BRIGHT: 'veryBright',
  BRIGHT: 'bright',
  NORMAL: 'normal',
  DARK: 'dark',
  VERY_DARK: 'veryDark',
};

function Label({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex gap-3 items-center">
      <div
        className="w-6 h-6 border-1 border-border-strong rounded-2"
        style={{ backgroundColor: color }}
      />
      <p>{label}</p>
    </div>
  );
}

const SKIN_COLOR_OPTIONS: ConsultingFormOption[] = [
  {
    label: <Label label="매우 밝음" color="#FFFCFB" />,
    value: SKIN_COLOR.VERY_BRIGHT,
  },
  {
    label: <Label label="밝음" color="#FFF6F1" />,
    value: SKIN_COLOR.BRIGHT,
  },
  {
    label: <Label label="보통" color="#FDF0E9" />,
    value: SKIN_COLOR.NORMAL,
  },
  {
    label: <Label label="어두움" color="#EFDDD4" />,
    value: SKIN_COLOR.DARK,
  },
  {
    label: <Label label="매우 어두움" color="#EAD3C8" />,
    value: SKIN_COLOR.VERY_DARK,
  },
];

export default function ConsultingPostFormStep5() {
  return (
    <ConsultingFormOptionList
      options={SKIN_COLOR_OPTIONS}
      name={`${CONSULTING_POST_FORM_FIELD_NAME.option5}`}
      canReset
    />
  );
}
