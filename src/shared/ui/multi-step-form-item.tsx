import type { FormStep } from '../type/form-step';

const MULTI_STEP_FORM_PORTAL_ID = 'multi-step-form-portal';

type MultiStepFormItemProps<T extends Record<string, unknown>> = {
  step: FormStep<T>;
};

export default function MultiStepFormItem<T extends Record<string, unknown>>({
  step,
}: MultiStepFormItemProps<T>) {
  const { question, required, description, children } = step;

  return (
    <>
      <form className="flex flex-col flex-1 min-h-0 px-5 pt-10 gap-7 relative">
        {(question || description) && (
          <div className="flex flex-col gap-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              {question && (
                <>
                  <p className="typo-title-3-semibold text-label-default title">{question}</p>
                  {
                    <span className="typo-body-2-semibold text-cautionary">
                      {required ? '필수' : '선택'}
                    </span>
                  }
                </>
              )}
            </div>
            {description && (
              <div className="typo-body-2-long-regular text-label-sub whitespace-pre-wrap">
                {description}
              </div>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-7">{children}</div>
      </form>
      <div id={MULTI_STEP_FORM_PORTAL_ID} />
    </>
  );
}
