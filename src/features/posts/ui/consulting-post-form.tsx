import ProgressPagination from '@/shared/ui/progress-pagination';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { ConsultingPostFormOption } from '../types/consulting-post-form-option';
import ConsultingPostFormOptionList from './consulting-post-form-option-list';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/shared';
import FormItemWithLabel from '@/shared/ui/form-item-with-label';

type FormStep = {
  question: string;
  description?: string;
  required: boolean;
  children: React.ReactNode;
};

const CONSULTING_POST_FORM_FIELD_NAME = {
  option1: 'option1',
} as const;

const formSchema = z.object({
  [CONSULTING_POST_FORM_FIELD_NAME.option1]: z.string(),
});

const options1: ConsultingPostFormOption[] = [
  {
    name: '원하는 스타일이 어울릴지/가능할지 궁금해요',
    label: '원하는 스타일이 어울릴지/가능할지 궁금해요',
    value: '원하는 스타일이 어울릴지/가능할지 궁금해요',
  },
  {
    name: '어울리는 스타일을 추천 받고 싶어요',
    label: '어울리는 스타일을 추천 받고 싶어요',
    value: '어울리는 스타일을 추천 받고 싶어요',
  },
  {
    name: '기타',
    label: '기타',
    value: '',
    additional: (
      <FormItemWithLabel label="기타 고민 상세 입력" required>
        <Textarea
          placeholder="어떤 고민이 있는지 상세히 설명해주세요"
          className="min-h-38 p-3 rounded-6 border-1 border-border-default"
        />
      </FormItemWithLabel>
    ),
  },
] as const;

const FORM_STEPS: FormStep[] = [
  {
    question: '어떤 헤어 고민이 있나요?',
    required: true,
    children: (
      <ConsultingPostFormOptionList
        options={options1}
        name={CONSULTING_POST_FORM_FIELD_NAME.option1}
      />
    ),
  },
  {
    question: '최근 2년 내 받은 시술을 입력하세요',
    required: true,
    children: <div>step 2</div>,
  },
  {
    question: '내 모습을 보여주세요',
    required: true,
    children: <div>step 3</div>,
  },
  {
    question: '평소 추구미를 알려주세요',
    required: false,
    children: <div>step 4</div>,
  },
  {
    question: '피부톤을 알려주세요',
    required: false,
    children: <div>step 5</div>,
  },
  {
    question: '전달하고 싶은 내용을 적어주세요',
    required: false,
    children: <div>step 6</div>,
  },
  {
    question: '글 제목을 입력하세요',
    description: '작성하지 않으면 고민 유형에 따라 자동으로 제목이 부여됩니다',
    required: false,
    children: <div>step 7</div>,
  },
] as const;

export default function ConsultingPostForm() {
  const method = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [step, setStep] = useState(1);

  const { question, required, description, children } = FORM_STEPS[step - 1];

  return (
    <FormProvider {...method}>
      <form className="flex flex-col px-5 py-7 gap-7 flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="typo-headline-medium text-label-default">{question}</p>
            {
              <span className="typo-body-3-semibold text-cautionary">
                {required ? '필수' : '선택'}
              </span>
            }
          </div>
          {description && <p className="typo-body-3-regular text-label-info">{description}</p>}
        </div>
        <div className="flex-1">{children}</div>
      </form>
      <div className="px-5 py-3">
        <ProgressPagination total={FORM_STEPS.length} current={step} onPageChange={setStep} />
      </div>
    </FormProvider>
  );
}
