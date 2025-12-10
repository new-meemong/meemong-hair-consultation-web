import { Input, Textarea } from '@/shared';

import { CONSULTING_POST_FORM_FIELD_NAME } from '@/features/posts/constants/consulting-post-form-field-name';
import type { ConsultingPostFormValues } from '@/features/posts/types/consulting-post-form-values';
import { useFormContext } from 'react-hook-form';
import { useRef } from 'react';

export default function ConsultingPostFormStepTitleAndConcern() {
  const { register } = useFormContext<ConsultingPostFormValues>();
  const concernRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref: concernRegisterRef, ...concernRegister } = register(
    `${CONSULTING_POST_FORM_FIELD_NAME.CONCERN}.additional`,
  );

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-end border-b-1 border-border-strong flex-shrink-0">
        <Input
          {...register(`${CONSULTING_POST_FORM_FIELD_NAME.TITLE}`)}
          placeholder="제목을 입력하세요"
          className="typo-title-3-medium h-13.5 flex-1"
          enterKeyHint="next"
          onBlur={() => {
            concernRef.current?.focus();
          }}
        />
        <span className="typo-body-2-semibold text-cautionary">필수</span>
      </div>
      <div className="flex-1 min-h-0 flex">
        <Textarea
          {...concernRegister}
          placeholder="헤어고민/요청사항을 간단하게 입력해주세요"
          className="flex-1 w-full"
          hasBorder
          fullHeight
          ref={(el) => {
            concernRegisterRef(el);
            concernRef.current = el;
          }}
        />
      </div>
    </div>
  );
}
