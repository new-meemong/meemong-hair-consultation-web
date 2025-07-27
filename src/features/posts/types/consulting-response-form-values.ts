import { z } from 'zod';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../constants/consulting-response-form-field-name';

export const consultingResponseFormSchema = z.object({
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option1]: z.string().optional(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option2]: z.string().optional(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option3]: z.string().optional(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option4]: z.string().optional(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option5]: z.string().optional(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option6]: z.string().optional(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option7]: z.string().optional(),
});

export type ConsultingResponseFormValues = z.infer<typeof consultingResponseFormSchema>;
