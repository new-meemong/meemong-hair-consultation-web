import z from 'zod';

import { CONSULTING_POST_FORM_FIELD_NAME } from '../constants/consulting-post-form-field-name';
import { HAIR_CONCERN_OPTION_VALUE } from '../constants/hair-concern-option';
import { MY_IMAGE_TYPE } from '../constants/my-image-type';
import { SKIN_TONE_OPTION_VALUE } from '../constants/skin-tone';

const MY_IMAGE_TYPES = [
  MY_IMAGE_TYPE.RECENT,
  MY_IMAGE_TYPE.FRONT,
  MY_IMAGE_TYPE.SIDE,
  MY_IMAGE_TYPE.WHOLE_BODY,
] as const;

const CONCERN_OPTION = [
  HAIR_CONCERN_OPTION_VALUE.DESIGN_POSSIBLE,
  HAIR_CONCERN_OPTION_VALUE.RECOMMEND_STYLE,
  HAIR_CONCERN_OPTION_VALUE.ETC,
] as const;

const SKIN_TONE_OPTION = [
  SKIN_TONE_OPTION_VALUE.VERY_BRIGHT,
  SKIN_TONE_OPTION_VALUE.BRIGHT,
  SKIN_TONE_OPTION_VALUE.NORMAL,
  SKIN_TONE_OPTION_VALUE.DARK,
  SKIN_TONE_OPTION_VALUE.VERY_DARK,
] as const;

export const consultingPostFormSchema = z.object({
  [CONSULTING_POST_FORM_FIELD_NAME.CONCERN]: z.object({
    value: z.enum(CONCERN_OPTION),
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
      type: z.enum(MY_IMAGE_TYPES),
      image: z.instanceof(File),
    }),
  ),
  [CONSULTING_POST_FORM_FIELD_NAME.ASPIRATION_IMAGES]: z.object({
    images: z.array(z.instanceof(File)).optional(),
    description: z.string(),
  }),
  [CONSULTING_POST_FORM_FIELD_NAME.SKIN_TONE]: z.enum(SKIN_TONE_OPTION).nullable(),
  [CONSULTING_POST_FORM_FIELD_NAME.CONTENT]: z.string().optional(),
  [CONSULTING_POST_FORM_FIELD_NAME.TITLE]: z.string().optional(),
  [CONSULTING_POST_FORM_FIELD_NAME.PRICE]: z.object({
    minPaymentPrice: z.number().nullable(),
    maxPaymentPrice: z.number().nullable(),
  }),
});

export type ConsultingPostFormValues = z.infer<typeof consultingPostFormSchema>;
