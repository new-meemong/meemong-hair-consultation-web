import type { FormStep } from '@/shared/type/form-step';
import type { KeyOf } from '@/shared/type/types';
import MultiStepForm from '@/shared/ui/multi-step-form';
import { FormProvider, useForm } from 'react-hook-form';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../../types/consulting-response-form-values';
import ConsultingResponseFormStep1 from './consulting-response-form-step-1';
import ConsultingResponseFormStep2 from './consulting-response-form-step-2';
import ConsultingResponseFormStep3 from './consulting-response-form-step-3';
import ConsultingResponseFormStep4 from './consulting-response-form-step-4';
import ConsultingResponseFormStep5 from './consulting-response-form-step-5';
import ConsultingResponseFormStep6 from './consulting-response-form-step-6';
import ConsultingResponseFormStep7 from './consulting-response-form-step-7';

const CONSULTING_RESPONSE_FORM_STEPS: FormStep<ConsultingResponseFormValues>[] = [
  {
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option1,
    question: '고객님의 얼굴형을 골라주세요',
    required: true,
    children: <ConsultingResponseFormStep1 />,
  },
  {
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option2,
    question: '고객님의 모발 타입을 골라주세요',
    required: false,
    children: <ConsultingResponseFormStep2 />,
  },
  {
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option3,
    question: '고객님의 손상도를 골라주세요',
    required: false,
    children: <ConsultingResponseFormStep3 />,
  },
  {
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option4,
    question: '앞머리 추천 여부를 골라주세요',
    required: true,
    children: <ConsultingResponseFormStep4 />,
  },
  {
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option5,
    question: '어울리는 스타일을 추천해주세요',
    required: true,
    children: <ConsultingResponseFormStep5 />,
  },
  {
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option6,
    question: '예상 시술 가격 견적을 작성해주세요',
    required: true,
    children: <ConsultingResponseFormStep6 />,
  },
  {
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option7,
    question: '컨설팅에 대한 코멘트를 작성하세요',
    required: false,
    children: <ConsultingResponseFormStep7 />,
  },
];

export default function ConsultingResponseForm() {
  const method = useForm<ConsultingResponseFormValues>({
    defaultValues: {
      [CONSULTING_RESPONSE_FORM_FIELD_NAME.option3]: 1,
      [CONSULTING_RESPONSE_FORM_FIELD_NAME.option5]: {
        images: [],
        description: '',
      },
    },
  });

  console.log('method.getValues()', method.getValues());

  const canMoveNext = (name: KeyOf<ConsultingResponseFormValues>) => {
    if (name === CONSULTING_RESPONSE_FORM_FIELD_NAME.option1) {
      const value = method.getValues(name);
      return !!value;
    }
    if (name === CONSULTING_RESPONSE_FORM_FIELD_NAME.option4) {
      const value = method.getValues(name);
      return value === null || value !== undefined;
    }
    if (name === CONSULTING_RESPONSE_FORM_FIELD_NAME.option5) {
      const value = method.getValues(name);
      return value && value.images.length > 0 && !!value.description;
    }
    if (name === CONSULTING_RESPONSE_FORM_FIELD_NAME.option6) {
      const value = method.getValues(name);
      return value && value.length > 0;
    }
    return true;
  };

  const submit = (values: ConsultingResponseFormValues) => {
    console.log('submit', values);
  };

  return (
    <FormProvider {...method}>
      <MultiStepForm
        steps={CONSULTING_RESPONSE_FORM_STEPS}
        canMoveNext={canMoveNext}
        onSubmit={submit}
        lastStepButtonLabel="보내기"
      />
    </FormProvider>
  );
}
