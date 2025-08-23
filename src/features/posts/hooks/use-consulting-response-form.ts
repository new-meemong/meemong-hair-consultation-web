import { useForm } from 'react-hook-form';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../types/consulting-response-form-values';

const DEFAULT_FORM_VALUES: Partial<ConsultingResponseFormValues> = {
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.DAMAGE_LEVEL]: 1,
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE]: {
    images: [],
    description: '',
  },
};

export default function useConsultingResponseForm({ postId }: { postId: string }) {
  const method = useForm<ConsultingResponseFormValues>({
    defaultValues: {
      ...DEFAULT_FORM_VALUES,
      [CONSULTING_RESPONSE_FORM_FIELD_NAME.POST_ID]: postId,
    },
  });

  return { method };
}
