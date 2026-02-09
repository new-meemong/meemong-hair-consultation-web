import { useEffect, useRef } from 'react';

import type { FormStep } from '../type/form-step';
import { cn } from '../lib';

const MULTI_STEP_FORM_PORTAL_ID = 'multi-step-form-portal';

type MultiStepFormItemProps<T extends Record<string, unknown>> = {
  step: FormStep<T>;
  className?: string;
};

export default function MultiStepFormItem<T extends Record<string, unknown>>({
  step,
  className,
}: MultiStepFormItemProps<T>) {
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    name,
    question,
    required,
    description,
    children,
    containerClassName,
    questionClassName,
    descriptionClassName,
    hideRequired,
  } = step;

  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.scrollTop = 0;
  }, [name]);

  return (
    <>
      <div
        className={cn(
          'flex flex-col flex-1 min-h-0 px-5 pt-7 gap-7 relative',
          containerClassName,
          className,
        )}
      >
        {(question || description) && (
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            <div className="flex items-center justify-between">
              {question && (
                <>
                  <p
                    className={cn(
                      'title',
                      questionClassName ?? 'typo-title-3-semibold text-label-default',
                    )}
                  >
                    {question}
                  </p>
                  {!hideRequired && (
                    <span className="typo-body-2-semibold text-cautionary">
                      {required ? '필수' : '선택'}
                    </span>
                  )}
                </>
              )}
            </div>
            {description && (
              <div
                className={cn(
                  'typo-body-2-long-regular text-label-sub whitespace-pre-wrap',
                  descriptionClassName,
                )}
              >
                {description}
              </div>
            )}
          </div>
        )}
        <div ref={contentRef} className="flex-1 overflow-y-auto scrollbar-hide pb-7">
          {children}
        </div>
      </div>
      <div id={MULTI_STEP_FORM_PORTAL_ID} />
    </>
  );
}
