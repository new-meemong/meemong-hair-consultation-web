import { useFormContext } from 'react-hook-form';

import { Textarea } from '@/shared';
import FormItem from '@/shared/ui/form-item';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';

export default function ConsultingResponseFormStepComment() {
  const { register } = useFormContext<ConsultingResponseFormValues>();

  return (
    <FormItem label="텍스트 입력" className="h-full flex flex-col">
      <Textarea
        {...register(CONSULTING_RESPONSE_FORM_FIELD_NAME.COMMENT)}
        placeholder="내 전문 분야, 경력 등 고객님에게 어필할 내용을 작성해보세요"
        hasBorder
        className="flex-1 min-h-0"
      />
    </FormItem>
  );
}
