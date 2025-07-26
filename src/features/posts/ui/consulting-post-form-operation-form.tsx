import { Input } from '@/shared';
import FormItemWithLabel from '@/shared/ui/form-item-with-label';
import { CONSULTING_POST_FORM_FIELD_NAME } from './consulting-post-form';
import { useFormContext } from 'react-hook-form';

export default function ConsultingPostFormOperationForm() {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col gap-5">
      <FormItemWithLabel hasUnderline label="시술명">
        <Input
          {...register(`${CONSULTING_POST_FORM_FIELD_NAME.option2}.name`)}
          placeholder="예)전체탈색, 블랙염색 등"
          className="typo-body-2-regular h-9"
        />
      </FormItemWithLabel>
    </div>
  );
}
