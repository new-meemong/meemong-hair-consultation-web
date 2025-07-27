import { Input } from '@/shared';
import FormItem from '@/shared/ui/form-item';
import { useFormContext } from 'react-hook-form';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../types/consulting-response-form-values';

export default function ConsultingResponseFormStep1() {
  const { register } = useFormContext<ConsultingResponseFormValues>();

  return (
    <FormItem hasUnderline>
      <Input
        {...register(`${CONSULTING_RESPONSE_FORM_FIELD_NAME.option1}`)}
        placeholder="제목을 입력하세요"
        className="typo-title-3-semibold h-13.5"
      />
    </FormItem>
  );
}
