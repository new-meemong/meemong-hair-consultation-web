import type { FormStep } from '@/shared/type/form-step';
import type { KeyOf } from '@/shared/type/types';
import MultiStepForm from '@/shared/ui/multi-step-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { CONSULTING_POST_FORM_FIELD_NAME } from '../../constants/consulting-post-form-field-name';
import {
  consultingPostFormSchema,
  type ConsultingPostFormValues,
} from '../../types/consulting-post-form-values';
import ConsultingPostFormStep1 from './consulting-post-form-step-1';
import ConsultingPostFormStep2 from './consulting-post-form-step-2';
import ConsultingPostFormStep3 from './consulting-post-form-step-3';
import ConsultingPostFormStep4 from './consulting-post-form-step-4';
import ConsultingPostFormStep5 from './consulting-post-form-step-5';
import ConsultingPostFormStep6 from './consulting-post-form-step-6';
import ConsultingPostFormStep7 from './consulting-post-form-step-7';

const CONSULTING_POST_FORM_STEPS: FormStep<ConsultingPostFormValues>[] = [
  {
    name: CONSULTING_POST_FORM_FIELD_NAME.option1,
    question: '어떤 헤어 고민이 있나요?',
    required: true,
    children: <ConsultingPostFormStep1 />,
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
    description: '올리신 사진은 디자이너들에게만 공개되며, 모델은 볼 수 없습니다.',
    required: true,
    children: <ConsultingPostFormStep3 />,
  },
  {
    name: CONSULTING_POST_FORM_FIELD_NAME.option4,
    question: '평소 추구미를 알려주세요',
    required: false,
    children: <ConsultingPostFormStep4 />,
  },
  {
    name: CONSULTING_POST_FORM_FIELD_NAME.option5,
    question: '피부톤을 알려주세요',
    required: false,
    children: <ConsultingPostFormStep5 />,
  },
  {
    name: CONSULTING_POST_FORM_FIELD_NAME.option6,
    question: '전달하고 싶은 내용을 적어주세요',
    required: false,
    children: <ConsultingPostFormStep6 />,
  },
  {
    name: CONSULTING_POST_FORM_FIELD_NAME.option7,
    question: '글 제목을 입력하세요',
    description: '작성하지 않으면 고민 유형에 따라 자동으로 제목이 부여됩니다',
    required: false,
    children: <ConsultingPostFormStep7 />,
  },
];

export default function ConsultingPostForm() {
  const method = useForm<ConsultingPostFormValues>({
    resolver: zodResolver(consultingPostFormSchema),
  });

  const canMoveNext = (name: KeyOf<ConsultingPostFormValues>) => {
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

    if (name === CONSULTING_POST_FORM_FIELD_NAME.option3) {
      const formValue = method.getValues(name);
      return formValue && formValue.length === 4;
    }

    return true;
  };

  const submit = (values: ConsultingPostFormValues) => {
    console.log('submit', values);
  };

  return (
    <FormProvider {...method}>
      <MultiStepForm
        steps={CONSULTING_POST_FORM_STEPS}
        canMoveNext={canMoveNext}
        onSubmit={submit}
      />
    </FormProvider>
  );
}
