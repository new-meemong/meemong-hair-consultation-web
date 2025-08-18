import { useFormContext } from 'react-hook-form';

import { Textarea } from '@/shared';
import FormItem from '@/shared/ui/form-item';

import { CONSULTING_POST_FORM_FIELD_NAME } from '../../../constants/consulting-post-form-field-name';
import type { ConsultingPostFormValues } from '../../../types/consulting-post-form-values';

export default function ConsultingPostFormStepContent() {
  const { register } = useFormContext<ConsultingPostFormValues>();
  return (
    <FormItem label="코멘트">
      <Textarea
        {...register(`${CONSULTING_POST_FORM_FIELD_NAME.CONTENT}`)}
        placeholder="상세 추가 코멘트를 입력하세요"
        hasBorder
        className="min-h-98.5"
      />
    </FormItem>
  );
}
