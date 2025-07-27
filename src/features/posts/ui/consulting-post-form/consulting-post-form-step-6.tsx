import { Textarea } from '@/shared';
import FormItem from '@/shared/ui/form-item';
import { useFormContext } from 'react-hook-form';
import type { ConsultingPostFormValues } from '../../types/consulting-post-form-values';
import { CONSULTING_POST_FORM_FIELD_NAME } from '../../constants/consulting-post-form-field-name';

export default function ConsultingPostFormStep6() {
  const { register } = useFormContext<ConsultingPostFormValues>();
  return (
    <FormItem label="코멘트">
      <Textarea
        {...register(`${CONSULTING_POST_FORM_FIELD_NAME.option6}`)}
        placeholder="상세 추가 코멘트를 입력하세요"
        hasBorder
        className="min-h-98.5"
      />
    </FormItem>
  );
}
