import z from 'zod';

import { CONSULTING_POST_FORM_FIELD_NAME } from '../constants/consulting-post-form-field-name';

export const CONSULTING_POST_FORM_IMAGE_POSITION = {
  FRONT: 'front',
  PONYTAIL_FRONT: 'ponytailFront',
  PONYTAIL_SIDE: 'ponytailSide',
  WHOLE: 'whole',
} as const;

const IMAGE_POSITIONS = [
  CONSULTING_POST_FORM_IMAGE_POSITION.FRONT,
  CONSULTING_POST_FORM_IMAGE_POSITION.PONYTAIL_FRONT,
  CONSULTING_POST_FORM_IMAGE_POSITION.PONYTAIL_SIDE,
  CONSULTING_POST_FORM_IMAGE_POSITION.WHOLE,
] as const;

export const consultingPostFormSchema = z.object({
  [CONSULTING_POST_FORM_FIELD_NAME.CONCERN]: z.object({
    value: z.string(),
    additional: z.string().optional(),
  }),
  [CONSULTING_POST_FORM_FIELD_NAME.TREATMENTS]: z
    .array(
      z.object({
        name: z.string(),
        date: z.date(),
      }),
    )
    .nullable(),
  [CONSULTING_POST_FORM_FIELD_NAME.MY_IMAGES]: z.array(
    z.object({
      position: z.enum(IMAGE_POSITIONS),
      image: z.instanceof(File),
    }),
  ),
  [CONSULTING_POST_FORM_FIELD_NAME.ASPIRATION_IMAGES]: z
    .object({
      images: z.array(z.instanceof(File)),
      description: z.string().optional(),
    })
    .optional(),
  [CONSULTING_POST_FORM_FIELD_NAME.option5]: z.string().optional(),
  [CONSULTING_POST_FORM_FIELD_NAME.option6]: z.string().optional(),
  [CONSULTING_POST_FORM_FIELD_NAME.option7]: z.string(),
});

export type ConsultingPostFormValues = z.infer<typeof consultingPostFormSchema>;
