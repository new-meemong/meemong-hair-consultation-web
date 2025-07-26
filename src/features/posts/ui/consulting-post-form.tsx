import ProgressPagination from '@/shared/ui/progress-pagination';
import { useState } from 'react';

type FormStep = {
  question: string;
  description?: string;
  required: boolean;
  children: React.ReactNode;
};

const FORM_STEPS: FormStep[] = [
  {
    question: '어떤 헤어 고민이 있나요?',
    required: true,
    children: <div>step 1</div>,
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
  const [step, setStep] = useState(1);

  const { question, required, description, children } = FORM_STEPS[step - 1];

  return (
    <>
      <form className="flex flex-col px-5 py-7 gap-7">
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
        consulting-post-form
      </form>
      <div className="px-5 py-3">
        <ProgressPagination total={FORM_STEPS.length} current={step} onPageChange={setStep} />
      </div>
    </>
  );
}
