import { useForm } from 'react-hook-form';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../types/consulting-response-form-values';

const DEFAULT_FORM_VALUES: Partial<ConsultingResponseFormValues> = {
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option3]: 1,
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option5]: {
    images: [],
    description: '',
  },
};

export default function useConsultingResponseForm() {
  const method = useForm<ConsultingResponseFormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  return { method };
}
