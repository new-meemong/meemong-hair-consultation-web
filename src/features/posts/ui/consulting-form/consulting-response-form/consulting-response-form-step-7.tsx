import { Textarea } from '@/shared';
import FormItem from '@/shared/ui/form-item';
import { useFormContext } from 'react-hook-form';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';

export default function ConsultingResponseFormStep7() {
  const { register } = useFormContext<ConsultingResponseFormValues>();

  return (
    <FormItem label="텍스트 입력" className="h-full flex flex-col">
      <Textarea
        {...register(CONSULTING_RESPONSE_FORM_FIELD_NAME.option7)}
        placeholder="코멘트를 입력하세요"
        hasBorder
        className="flex-1 min-h-0"
      />
    </FormItem>
  );
}
