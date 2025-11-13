import { useRef } from 'react';

import { useFormContext } from 'react-hook-form';

import { Input, Textarea } from '@/shared';

import { EXPERIENCE_GROUP_FORM_FIELD_NAME } from '../../constants/experience-group/experience-group-form-field-name';
import type { ExperienceGroupFormValues } from '../../types/experience-group-form-values';

export default function ExperienceGroupFormStepTitleAndContent() {
  const { register } = useFormContext<ExperienceGroupFormValues>();

  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const { ref: contentRegisterRef, ...contentRegister } = register(
    `${EXPERIENCE_GROUP_FORM_FIELD_NAME.CONTENT}`,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end border-b-1 border-border-strong">
        <Input
          {...register(`${EXPERIENCE_GROUP_FORM_FIELD_NAME.TITLE}`)}
          placeholder="제목을 입력하세요"
          className="typo-title-3-medium h-13.5 flex-1 placeholder:text-label-info"
          enterKeyHint="next"
          onBlur={() => {
            contentRef.current?.focus();
          }}
        />
        <span className="typo-body-2-semibold text-cautionary">필수</span>
      </div>
      <Textarea
        {...contentRegister}
        placeholder={`1. 어떤 방식의 협찬이 가능한지 설명해주세요\n(블로그 후기, 인스타그램 태그 게시물 등)\n\n2. 어떤 시술을 받고 싶은지 설명해주세요\n(헤어, 네일 / 스타일 / 상관없음 등)`}
        className="min-h-38 placeholder:text-label-info"
        ref={(el) => {
          contentRegisterRef(el);
          contentRef.current = el;
        }}
      />
    </div>
  );
}
