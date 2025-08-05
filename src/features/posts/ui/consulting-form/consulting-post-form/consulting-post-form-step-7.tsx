import FormItem from '@/shared/ui/form-item';
import { Input } from '@/shared';
import { useFormContext } from 'react-hook-form';
import type { ConsultingPostFormValues } from '../../../types/consulting-post-form-values';
import { CONSULTING_POST_FORM_FIELD_NAME } from '../../../constants/consulting-post-form-field-name';

export default function ConsultingPostFormStep7() {
  const { register } = useFormContext<ConsultingPostFormValues>();

  return (
    <FormItem hasUnderline>
      <Input
        {...register(`${CONSULTING_POST_FORM_FIELD_NAME.option7}`)}
        placeholder="제목을 입력하세요"
        className="typo-body-2-regular h-9"
      />
    </FormItem>
  );
}
