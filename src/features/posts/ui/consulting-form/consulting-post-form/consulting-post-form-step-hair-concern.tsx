import { useFormContext } from 'react-hook-form';

import {
  HAIR_CONCERN_OPTION_VALUE,
  HAIR_CONCERN_OPTIONS,
} from '@/features/posts/constants/hair-concern-option';
import { Textarea } from '@/shared';
import FormItem from '@/shared/ui/form-item';

import { CONSULTING_POST_FORM_FIELD_NAME } from '../../../constants/consulting-post-form-field-name';
import type { ConsultingFormOption } from '../../../types/consulting-form-option';
import type { ConsultingPostFormValues } from '../../../types/consulting-post-form-values';
import ConsultingFormOptionList from '../consulting-form-option-list';

export default function ConsultingPostFormStepHairConcern() {
  const method = useFormContext<ConsultingPostFormValues>();

  const options: ConsultingFormOption[] = HAIR_CONCERN_OPTIONS.map((option) => ({
    ...option,
    additional:
      option.value === HAIR_CONCERN_OPTION_VALUE.ETC ? (
        <FormItem label="기타 고민 상세 입력" required>
          <Textarea
            {...method.register(`${CONSULTING_POST_FORM_FIELD_NAME.HAIR_CONCERN}.additional`)}
            placeholder="어떤 고민이 있는지 상세히 설명해주세요"
            className="min-h-38"
            hasBorder
          />
        </FormItem>
      ) : undefined,
  }));

  return (
    <ConsultingFormOptionList
      options={options}
      name={`${CONSULTING_POST_FORM_FIELD_NAME.HAIR_CONCERN}.value`}
    />
  );
}
