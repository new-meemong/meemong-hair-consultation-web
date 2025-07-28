import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { FormStep } from '../type/form-step';
import type { KeyOf } from '../type/types';
import type { Path } from 'react-hook-form';
import ProgressPagination from './progress-pagination';

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

  useWatch({
    name: name as Path<T>,
    control: method.control,
  });

  const handleNextButtonClick = () => {
    if (!isLastStep) return;

    onSubmit(method.getValues());
  };

  return (
    <>
      <form className="flex flex-col flex-1 min-h-0 px-5 py-7 gap-7">
        <div className="flex flex-col gap-3 flex-shrink-0">
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
        <div className="flex-1 overflow-y-auto">{children}</div>
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
