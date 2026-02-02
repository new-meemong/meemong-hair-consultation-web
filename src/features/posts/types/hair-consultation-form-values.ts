import {
  HAIR_CONSULTATION_CONCERN_OPTIONS,
  HAIR_CONSULTATION_HAIR_LENGTH_VALUES,
  HAIR_CONSULTATION_HAIR_TEXTURE_VALUES,
  HAIR_CONSULTATION_PERSONAL_COLOR_VALUES,
  HAIR_CONSULTATION_SKIN_BRIGHTNESS_VALUES,
} from '../constants/hair-consultation-create-options';

import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '../constants/hair-consultation-form-field-name';
import { MY_IMAGE_TYPE } from '@/features/posts/constants/my-image-type';
import z from 'zod';

const MY_IMAGE_TYPES = [
  MY_IMAGE_TYPE.RECENT,
  MY_IMAGE_TYPE.FRONT,
  MY_IMAGE_TYPE.SIDE,
  MY_IMAGE_TYPE.WHOLE_BODY,
] as const;

export const hairConsultationFormSchema = z.object({
  [HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_LENGTH]: z.enum(
    HAIR_CONSULTATION_HAIR_LENGTH_VALUES,
  ),
  [HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_CONCERNS]: z
    .array(z.enum(HAIR_CONSULTATION_CONCERN_OPTIONS))
    .min(1),
  [HAIR_CONSULTATION_FORM_FIELD_NAME.HAIR_TEXTURE]: z.enum(
    HAIR_CONSULTATION_HAIR_TEXTURE_VALUES,
  ),
  [HAIR_CONSULTATION_FORM_FIELD_NAME.SKIN_BRIGHTNESS]: z.enum(
    HAIR_CONSULTATION_SKIN_BRIGHTNESS_VALUES,
  ),
  [HAIR_CONSULTATION_FORM_FIELD_NAME.PERSONAL_COLOR]: z.enum(
    HAIR_CONSULTATION_PERSONAL_COLOR_VALUES,
  ),
  [HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENTS]: z
    .array(
      z.object({
        name: z.string(),
        date: z.date(),
      }),
    )
    .nullable(),
  [HAIR_CONSULTATION_FORM_FIELD_NAME.MY_IMAGES]: z.array(
    z.object({
      type: z.enum(MY_IMAGE_TYPES),
      image: z.instanceof(File),
    }),
  ),
  [HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES]: z.object({
    images: z.array(z.instanceof(File)).optional(),
    description: z.string(),
  }),
  [HAIR_CONSULTATION_FORM_FIELD_NAME.PRICE]: z.object({
    minPaymentPrice: z.number().nullable(),
    maxPaymentPrice: z.number().nullable(),
  }),
  [HAIR_CONSULTATION_FORM_FIELD_NAME.CONTENT]: z.string(),
  [HAIR_CONSULTATION_FORM_FIELD_NAME.TITLE]: z.string(),
});

export type HairConsultationFormValues = z.infer<typeof hairConsultationFormSchema>;
