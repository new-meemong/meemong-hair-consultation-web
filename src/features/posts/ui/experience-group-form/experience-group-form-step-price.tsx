import { useFormContext, useWatch } from 'react-hook-form';

import type { ValueOf } from '@/shared/type/types';

import { EXPERIENCE_GROUP_FORM_FIELD_NAME } from '../../constants/experience-group/experience-group-form-field-name';
import { EXPERIENCE_GROUP_PRICE_TYPE } from '../../constants/experience-group-price-type';
import type { ExperienceGroupFormValues } from '../../types/experience-group-form-values';
import ConsultingFormPriceInput from '../consulting-form/consulting-form-price-input';

type ExperienceGroupFormStepPriceProps = {
  priceType: Exclude<ValueOf<typeof EXPERIENCE_GROUP_PRICE_TYPE>, 'FREE'>;
};

const LABEL = {
  [EXPERIENCE_GROUP_PRICE_TYPE.PAY]: '최소',
  [EXPERIENCE_GROUP_PRICE_TYPE.MATERIAL_COST]: '최대',
};

export default function ExperienceGroupFormStepPrice({
  priceType,
}: ExperienceGroupFormStepPriceProps) {
  const { control, setValue } = useFormContext<ExperienceGroupFormValues>();

  const price = useWatch({
    name: EXPERIENCE_GROUP_FORM_FIELD_NAME.PRICE,
    control,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(EXPERIENCE_GROUP_FORM_FIELD_NAME.PRICE, Number(e.target.value));
  };

  return (
    <ConsultingFormPriceInput
      name="price"
      value={price?.toString() ?? ''}
      onChange={handleChange}
      label={LABEL[priceType]}
      hasValid={false}
    />
  );
}
