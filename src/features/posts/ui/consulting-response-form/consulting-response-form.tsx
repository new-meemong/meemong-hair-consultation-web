import type { FormStep } from '@/shared/type/form-step';
import type { KeyOf } from '@/shared/type/types';
import MultiStepForm from '@/shared/ui/multi-step-form';
import { FormProvider, useForm } from 'react-hook-form';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../../types/consulting-response-form-values';
import ConsultingResponseFormStep1 from './consulting-response-form-step-1';
import ConsultingResponseFormStep2 from './consulting-response-form-step-2';

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
];

export default function ConsultingResponseForm() {
  const method = useForm<ConsultingResponseFormValues>();

  console.log('method.getValues()', method.getValues());

  const canMoveNext = (name: KeyOf<ConsultingResponseFormValues>) => {
    if (name === CONSULTING_RESPONSE_FORM_FIELD_NAME.option1) {
      const value = method.getValues(name);
      return !!value;
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
      />
    </FormProvider>
  );
}
