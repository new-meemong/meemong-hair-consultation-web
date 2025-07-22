import ProgressPagination from '@/shared/ui/progress-pagination';
import { useState } from 'react';

type FormStep = {
  question: string;
  required: boolean;
  children: React.ReactNode;
};

const FORM_STEPS: FormStep[] = [
  {
    question: '질문 1',
    required: true,
    children: <div>step 1</div>,
  },
  {
    question: '질문 2',
    required: true,
    children: <div>step 2</div>,
  },
  {
    question: '질문 3',
    required: true,
    children: <div>step 3</div>,
  },
  {
    question: '질문 4',
    required: false,
    children: <div>step 4</div>,
  },
  {
    question: '질문 5',
    required: true,
    children: <div>step 5</div>,
  },
  {
    question: '질문 6',
    required: true,
    children: <div>step 6</div>,
  },
  {
    question: '질문 7',
    required: false,
    children: <div>step 7</div>,
  },
];

export default function ConsultingPostForm() {
  const [step, setStep] = useState(1);

  return (
    <div>
      consulting-post-form
      <div className="px-5 py-3">
        <ProgressPagination total={FORM_STEPS.length} current={step} onPageChange={setStep} />
      </div>
    </div>
  );
}
