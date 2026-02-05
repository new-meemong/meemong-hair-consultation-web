import { Input, Textarea } from '@/shared';

import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '../../constants/hair-consultation-form-field-name';
import type { HairConsultationFormValues } from '../../types/hair-consultation-form-values';
import { useFormContext } from 'react-hook-form';
import { useRef } from 'react';

export default function HairConsultationFormStepTitleContent() {
  const { register } = useFormContext<HairConsultationFormValues>();
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref: contentRegisterRef, ...contentRegister } = register(
    HAIR_CONSULTATION_FORM_FIELD_NAME.CONTENT,
  );

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center border-b-1 border-border-strong flex-shrink-0">
        <Input
          {...register(HAIR_CONSULTATION_FORM_FIELD_NAME.TITLE)}
          placeholder="제목을 입력하세요"
          className="typo-title-3-medium h-13.5 flex-1"
          enterKeyHint="next"
          onBlur={() => {
            contentRef.current?.focus();
          }}
        />
      </div>
      <div className="flex-1 min-h-0 flex">
        <Textarea
          {...contentRegister}
          placeholder="컨설팅받고 싶은 내용을 자유롭게 작성해주세요."
          className="flex-1 w-full"
          hasBorder
          fullHeight
          ref={(el) => {
            contentRegisterRef(el);
            contentRef.current = el;
          }}
        />
      </div>
    </div>
  );
}
