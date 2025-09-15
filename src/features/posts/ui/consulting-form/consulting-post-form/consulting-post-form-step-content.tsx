import { useFormContext } from 'react-hook-form';

import { Textarea } from '@/shared';
import FormItem from '@/shared/ui/form-item';

import { CONSULTING_POST_FORM_FIELD_NAME } from '../../../constants/consulting-post-form-field-name';
import type { ConsultingPostFormValues } from '../../../types/consulting-post-form-values';

export default function ConsultingPostFormStepContent() {
  const { register } = useFormContext<ConsultingPostFormValues>();
  return (
    <FormItem>
      <Textarea
        {...register(`${CONSULTING_POST_FORM_FIELD_NAME.CONTENT}`)}
        placeholder="기타 요청사항 입력"
        hasBorder
        className="min-h-98.5"
      />
    </FormItem>
  );
}
