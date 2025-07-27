import z from 'zod';
import { CONSULTING_POST_FORM_FIELD_NAME } from '../constants/consulting-post-form-field-name';

export const consultingPostFormSchema = z.object({
  [CONSULTING_POST_FORM_FIELD_NAME.option1]: z.object({
    value: z.string(),
    additional: z.string().optional(),
  }),
  [CONSULTING_POST_FORM_FIELD_NAME.option2]: z
    .array(
      z.object({
        name: z.string(),
        date: z.date(),
      }),
    )
    .nullable(),
});

export type ConsultingPostFormValues = z.infer<typeof consultingPostFormSchema>;
