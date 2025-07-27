import type { FormStep } from '@/shared/type/form-step';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../types/consulting-response-form-values';
import { FormProvider, useForm } from 'react-hook-form';
import MultiStepForm from '@/shared/ui/multi-step-form';
import type { KeyOf } from '@/shared/type/types';
import ConsultingResponseFormStep1 from './consulting-response-form-step-1';
import ConsultingResponseFormStep2 from './consulting-response-form-step-2';

const CONSULTING_RESPONSE_FORM_STEPS: FormStep<ConsultingResponseFormValues>[] = [
  {
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option1,
    question: '컨설팅 제목을 입력하세요',
    description: '작성하지 않으면 고민 유형에 따라 자동으로 제목이 부여됩니다',
    required: false,
    children: <ConsultingResponseFormStep1 />,
  },
  {
    name: CONSULTING_RESPONSE_FORM_FIELD_NAME.option2,
    question: '고객님의 얼굴형을 골라주세요',
    required: true,
    children: <ConsultingResponseFormStep2 />,
  },
];

export default function ConsultingResponseForm() {
  const method = useForm<ConsultingResponseFormValues>();

  const canMoveNext = (name: KeyOf<ConsultingResponseFormValues>) => {
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
      />
    </FormProvider>
  );
}
