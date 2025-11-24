import { useFormContext, useWatch } from 'react-hook-form';


import MultiStepFormItem from './multi-step-form-item';
import ProgressPagination from './progress-pagination';
import { Separator } from './separator';
import type { FormStep } from '../type/form-step';
import type { KeyOf } from '../type/types';

type MultiStepFormProps<T extends Record<string, unknown>> = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  steps: (FormStep<T> | FormStep<T>[])[];
  canMoveNext: (name: KeyOf<T> | Array<KeyOf<T>>) => boolean;
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
  const step = steps[currentStep - 1];

  const isLastStep = currentStep === steps.length;

  const method = useFormContext<T>();

  useWatch({ control: method.control });

  const handleNextButtonClick = () => {
    if (!isLastStep) return;

    onSubmit(method.getValues());
  };

  const disabledToNext = () => {
    if (Array.isArray(step)) {
      const requiredSteps = step.filter((step) => step.required);
      return requiredSteps.length > 0 && !requiredSteps.every((step) => canMoveNext(step.name));
    }
    return step.required && !canMoveNext(step.name);
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
        />
      </div>
    </>
  );
}
