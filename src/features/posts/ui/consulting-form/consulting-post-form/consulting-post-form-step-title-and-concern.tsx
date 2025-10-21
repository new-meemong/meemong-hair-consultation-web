import { useFormContext } from 'react-hook-form';

import { CONSULTING_POST_FORM_FIELD_NAME } from '@/features/posts/constants/consulting-post-form-field-name';
import type { ConsultingPostFormValues } from '@/features/posts/types/consulting-post-form-values';
import { Input, Textarea } from '@/shared';

export default function ConsultingPostFormStepTitleAndConcern() {
  const { register } = useFormContext<ConsultingPostFormValues>();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end border-b-1 border-border-strong">
        <Input
          {...register(`${CONSULTING_POST_FORM_FIELD_NAME.TITLE}`)}
          placeholder="제목을 입력하세요"
          className="typo-title-3-medium h-13.5 flex-1"
        />
        <span className="typo-body-2-semibold text-cautionary">필수</span>
      </div>
      <Textarea
        {...register(`${CONSULTING_POST_FORM_FIELD_NAME.CONCERN}.additional`)}
        placeholder="헤어고민/요청사항을 간단하게 입력해주세요"
        className="min-h-38"
      />
    </div>
  );
}
