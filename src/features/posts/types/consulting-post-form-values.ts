import z from 'zod';

import { CONSULTING_POST_FORM_FIELD_NAME } from '../constants/consulting-post-form-field-name';
import { HAIR_CONCERN_OPTION_LABEL } from '../constants/hair-concern-option';
import { HAIR_IMAGE_POSITION } from '../constants/hair-image-position';

const IMAGE_POSITIONS = [
  HAIR_IMAGE_POSITION.FRONT_LOOSE,
  HAIR_IMAGE_POSITION.FRONT_TIED,
  HAIR_IMAGE_POSITION.SIDE_TIED,
  HAIR_IMAGE_POSITION.UPPER_BODY,
] as const;

const CONCERN_OPTION = [
  HAIR_CONCERN_OPTION_LABEL.designPossible,
  HAIR_CONCERN_OPTION_LABEL.recommendStyle,
  HAIR_CONCERN_OPTION_LABEL.etc,
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
  [CONSULTING_POST_FORM_FIELD_NAME.SKIN_TONE]: z.string().optional(),
  [CONSULTING_POST_FORM_FIELD_NAME.CONTENT]: z.string().optional(),
  [CONSULTING_POST_FORM_FIELD_NAME.TITLE]: z.string(),
});

export type ConsultingPostFormValues = z.infer<typeof consultingPostFormSchema>;
