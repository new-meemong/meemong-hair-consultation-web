import { z } from 'zod';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../constants/consulting-response-form-field-name';
import { FACE_TYPE } from '../ui/consulting-response-form/consulting-response-form-step-2';

const FACE_TYPE_VALUES = [
  FACE_TYPE.OVAL,
  FACE_TYPE.DIAMOND,
  FACE_TYPE.HEART,
  FACE_TYPE.PEANUT,
  FACE_TYPE.HEXAGONAL,
  FACE_TYPE.ROUND,
] as const;

export const consultingResponseFormSchema = z.object({
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option1]: z.string().optional(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option2]: z.enum(FACE_TYPE_VALUES),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option3]: z.string().optional(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option4]: z.string().optional(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option5]: z.string().optional(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option6]: z.string().optional(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option7]: z.string().optional(),
});

export type ConsultingResponseFormValues = z.infer<typeof consultingResponseFormSchema>;
