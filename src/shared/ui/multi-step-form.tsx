import { useState } from 'react';
import type { FormStep } from '../type/form-step';
import ProgressPagination from './progress-pagination';
import type { KeyOf } from '../type/types';
import { useFormContext } from 'react-hook-form';

type MultiStepFormProps<T extends Record<string, unknown>> = {
  steps: FormStep<T>[];
  canMoveNext: (name: KeyOf<T>) => boolean;
  onSubmit: (values: T) => void;
};

export default function MultiStepForm<T extends Record<string, unknown>>({
  steps,
  canMoveNext,
  onSubmit,
}: MultiStepFormProps<T>) {
  const method = useFormContext<T>();

  const [step, setStep] = useState(1);

  const { question, required, description, children, name } = steps[step - 1];

  const isLastStep = step === steps.length;

  const handleNextButtonClick = () => {
    if (!isLastStep) return;

    onSubmit(method.getValues());
  };

  return (
    <>
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
        <ProgressPagination
          total={steps.length}
          current={step}
          onPageChange={setStep}
          disabledToNext={required && !canMoveNext(name)}
          nextButtonLabel={isLastStep ? '저장' : undefined}
          onNextButtonClick={handleNextButtonClick}
        />
      </div>
    </>
  );
}
