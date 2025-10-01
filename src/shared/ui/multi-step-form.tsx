import type { Path } from 'react-hook-form';
import { useFormContext, useWatch } from 'react-hook-form';

import type { FormStep } from '../type/form-step';
import type { KeyOf } from '../type/types';

import ProgressPagination from './progress-pagination';

export const MULTI_STEP_FORM_PORTAL_ID = 'multi-step-form-portal';

type MultiStepFormProps<T extends Record<string, unknown>> = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  steps: FormStep<T>[];
  canMoveNext: (name: KeyOf<T>) => boolean;
  onSubmit: (values: T) => void;
  lastStepButtonLabel: string;
};

export default function MultiStepForm<T extends Record<string, unknown>>({
  currentStep,
  setCurrentStep,
  steps,
  canMoveNext,
  onSubmit,
  lastStepButtonLabel,
}: MultiStepFormProps<T>) {
  const method = useFormContext<T>();

  const { question, required, description, children, name } = steps[currentStep - 1];

  const isLastStep = currentStep === steps.length;

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
      <form className="flex flex-col flex-1 min-h-0 px-5 pt-10 gap-7 relative">
        <div className="flex flex-col gap-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <p className="typo-headline-medium text-label-default">{question}</p>
            {
              <span className="typo-body-2-semibold text-cautionary">
                {required ? '필수' : '선택'}
              </span>
            }
          </div>
          {description && (
            <p className="typo-body-2-long-regular text-label-sub whitespace-pre-wrap">
              {description}
            </p>
          )}
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-7">{children}</div>
        <div id={MULTI_STEP_FORM_PORTAL_ID} />
      </form>
      <div className="px-5 py-3 border-t border-1 border-border-default">
        <ProgressPagination
          total={steps.length}
          current={currentStep}
          onPageChange={setCurrentStep}
          disabledToNext={required && !canMoveNext(name)}
          nextButtonLabel={isLastStep ? lastStepButtonLabel : undefined}
          onNextButtonClick={handleNextButtonClick}
        />
      </div>
    </>
  );
}
