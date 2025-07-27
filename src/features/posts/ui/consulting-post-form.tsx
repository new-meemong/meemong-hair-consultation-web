import { Textarea } from '@/shared';
import FormItemWithLabel from '@/shared/ui/form-item-with-label';
import ProgressPagination from '@/shared/ui/progress-pagination';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';
import { CONSULTING_POST_FORM_FIELD_NAME } from '../constants/consulting-post-form-field-name';
import type { ConsultingPostFormOption } from '../types/consulting-post-form-option';
import {
  consultingPostFormSchema,
  type ConsultingPostFormValues,
} from '../types/consulting-post-form-values';
import ConsultingPostFormOptionList from './consulting-post-form-option-list';
import ConsultingPostFormStep2 from './consulting-post-form-step-2';

type FormStep = {
  name: keyof ConsultingPostFormValues;
  question: string;
  description?: string;
  required: boolean;
  children: React.ReactNode;
};

function getOption1(method: UseFormReturn<ConsultingPostFormValues>): ConsultingPostFormOption[] {
  return [
    {
      label: '원하는 스타일이 어울릴지/가능할지 궁금해요',
      value: '원하는 스타일이 어울릴지/가능할지 궁금해요',
    },
    {
      label: '어울리는 스타일을 추천 받고 싶어요',
      value: '어울리는 스타일을 추천 받고 싶어요',
    },
    {
      label: '기타',
      value: '기타',
      additional: (
        <FormItemWithLabel label="기타 고민 상세 입력" required>
          <Textarea
            {...method.register(`${CONSULTING_POST_FORM_FIELD_NAME.option1}.additional`)}
            placeholder="어떤 고민이 있는지 상세히 설명해주세요"
            className="min-h-38 p-3 rounded-6 border-1 border-border-default"
          />
        </FormItemWithLabel>
      ),
    },
  ] as const;
}

function getFormSteps(method: UseFormReturn<ConsultingPostFormValues>): FormStep[] {
  return [
    {
      name: CONSULTING_POST_FORM_FIELD_NAME.option1,
      question: '어떤 헤어 고민이 있나요?',
      required: true,
      children: (
        <ConsultingPostFormOptionList
          options={getOption1(method)}
          name={`${CONSULTING_POST_FORM_FIELD_NAME.option1}.value`}
        />
      ),
    },
    {
      name: CONSULTING_POST_FORM_FIELD_NAME.option2,
      question: '최근 2년 내 받은 시술을 입력하세요',
      required: true,
      children: <ConsultingPostFormStep2 />,
    },
    {
      name: CONSULTING_POST_FORM_FIELD_NAME.option3,
      question: '내 모습을 보여주세요',
      required: true,
      children: <div>step 3</div>,
    },
    {
      name: CONSULTING_POST_FORM_FIELD_NAME.option4,
      question: '평소 추구미를 알려주세요',
      required: false,
      children: <div>step 4</div>,
    },
    {
      name: CONSULTING_POST_FORM_FIELD_NAME.option5,
      question: '피부톤을 알려주세요',
      required: false,
      children: <div>step 5</div>,
    },
    {
      name: CONSULTING_POST_FORM_FIELD_NAME.option6,
      question: '전달하고 싶은 내용을 적어주세요',
      required: false,
      children: <div>step 6</div>,
    },
    {
      name: CONSULTING_POST_FORM_FIELD_NAME.option7,
      question: '글 제목을 입력하세요',
      description: '작성하지 않으면 고민 유형에 따라 자동으로 제목이 부여됩니다',
      required: false,
      children: <div>step 7</div>,
    },
  ] as const;
}

export default function ConsultingPostForm() {
  const method = useForm<ConsultingPostFormValues>({
    resolver: zodResolver(consultingPostFormSchema),
  });
  const [step, setStep] = useState(1);

  console.log('method.watch()', method.watch());

  const { question, required, description, children, name } = getFormSteps(method)[step - 1];

  const availableToNext = () => {
    if (name === CONSULTING_POST_FORM_FIELD_NAME.option1) {
      const formValue = method.getValues(name);
      return (
        (formValue?.value && formValue.value !== '기타') ||
        (formValue?.value === '기타' && formValue?.additional !== '')
      );
    }

    if (name === CONSULTING_POST_FORM_FIELD_NAME.option2) {
      const formValue = method.getValues(name);
      return formValue === null || formValue?.length > 0;
    }
  };

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
        <ProgressPagination
          total={getFormSteps(method).length}
          current={step}
          onPageChange={setStep}
          disabledToNext={!availableToNext()}
        />
      </div>
    </FormProvider>
  );
}
