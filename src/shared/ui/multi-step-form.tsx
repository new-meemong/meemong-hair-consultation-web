import { type FieldErrors, useFormContext, useWatch } from 'react-hook-form';

import type { FormStep } from '../type/form-step';
import type { KeyOf } from '../type/types';
import { showGlobalErrorOnce } from '../lib/global-overlay';
import MultiStepFormItem from './multi-step-form-item';
import ProgressPagination from './progress-pagination';
import { Separator } from './separator';

type MultiStepFormProps<T extends Record<string, unknown>> = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  steps: (FormStep<T> | FormStep<T>[])[];
  canMoveNext: (name: KeyOf<T> | Array<KeyOf<T>>) => boolean;
  onSubmit: (values: T) => void | Promise<void>;
  onInvalid?: (errors: FieldErrors<T>) => void;
  lastStepButtonLabel: string;
  isSubmitting?: boolean;
};

export default function MultiStepForm<T extends Record<string, unknown>>({
  currentStep,
  setCurrentStep,
  steps,
  canMoveNext,
  onSubmit,
  onInvalid,
  lastStepButtonLabel,
  isSubmitting = false,
}: MultiStepFormProps<T>) {
  const step = steps[currentStep - 1];

  const isLastStep = currentStep === steps.length;

  const method = useFormContext<T>();

  useWatch({ control: method.control });

  const handleNextButtonClick = () => {
    if (!isLastStep || isSubmitting) return;

    void method.handleSubmit(
      (values) => onSubmit(values),
      (errors) => {
        if (onInvalid) {
          onInvalid(errors);
          return;
        }

        showGlobalErrorOnce('입력을 확인해주세요.');
      },
    )();
  };

  const disabledToNext = () => {
    if (Array.isArray(step)) {
      const requiredSteps = step.filter((step) => step.required);
      return (
        isSubmitting ||
        (requiredSteps.length > 0 && !requiredSteps.every((step) => canMoveNext(step.name)))
      );
    }
    return isSubmitting || (step.required && !canMoveNext(step.name));
  };

  return (
    <>
      {Array.isArray(step) ? (
        <div className="overflow-y-auto">
          {step.map((stepItem, index) => (
            <div key={stepItem.name.toString()} className="w-full">
              <MultiStepFormItem step={stepItem} />
              {index !== step.length - 1 && (
                <div className="px-5">
                  <Separator />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <MultiStepFormItem step={step} />
      )}
      <div className="px-5 py-3 border-t border-1 border-border-default">
        <ProgressPagination
          total={steps.length}
          current={currentStep}
          onPageChange={setCurrentStep}
          disabledToNext={disabledToNext()}
          nextButtonLabel={isLastStep ? lastStepButtonLabel : undefined}
          onNextButtonClick={handleNextButtonClick}
          isSubmitting={isSubmitting && isLastStep}
        />
      </div>
    </>
  );
}
