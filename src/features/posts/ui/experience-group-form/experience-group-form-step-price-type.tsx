import { useFormContext, useWatch } from 'react-hook-form';

import MultiStepFormItem from '@/shared/ui/multi-step-form-item';

import ExperienceGroupFormStepPrice from './experience-group-form-step-price';
import { EXPERIENCE_GROUP_FORM_FIELD_NAME } from '../../constants/experience-group/experience-group-form-field-name';
import { EXPERIENCE_GROUP_PRICE_TYPE } from '../../constants/experience-group-price-type';
import type { ConsultingFormOption } from '../../types/consulting-form-option';
import type { ExperienceGroupFormValues } from '../../types/experience-group-form-values';
import ConsultingFormOptionList from '../consulting-form/consulting-form-option-list';


const PRICE_TYPE_OPTIONS: ConsultingFormOption[] = [
  {
    label: '페이를 받아요',
    value: 'PAY',
  },
  {
    label: '무료시술 원해요',
    value: 'FREE',
  },
  {
    label: '재료비 낼 수 있어요',
    value: 'MATERIAL_COST',
  },
] as const;

export default function ExperienceGroupFormStepPriceType() {
  const { control, setValue } = useFormContext<ExperienceGroupFormValues>();

  const priceType = useWatch({
    name: EXPERIENCE_GROUP_FORM_FIELD_NAME.PRICE_TYPE,
    control,
  });

  const priceInputShowed = priceType && priceType !== EXPERIENCE_GROUP_PRICE_TYPE.FREE;

  const handleChange = () => {
    setValue(EXPERIENCE_GROUP_FORM_FIELD_NAME.PRICE, undefined, { shouldDirty: true });
  };

  return (
    <div>
      <ConsultingFormOptionList
        options={PRICE_TYPE_OPTIONS}
        name={EXPERIENCE_GROUP_FORM_FIELD_NAME.PRICE_TYPE}
        onChange={handleChange}
      />
      {priceInputShowed && (
        <MultiStepFormItem
          step={{
            name: EXPERIENCE_GROUP_FORM_FIELD_NAME.PRICE,
            question: '금액을 입력해주세요',
            required: true,
            children: <ExperienceGroupFormStepPrice priceType={priceType} />,
          }}
          className="px-0"
        />
      )}
    </div>
  );
}
