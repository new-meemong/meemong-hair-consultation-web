import { z } from 'zod';

import { BANG_STYLE } from '../constants/bang-style';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../constants/consulting-response-form-field-name';
import { FACE_SHAPE } from '../constants/face-shape';
import { HAIR_TYPE } from '../constants/hair-type';

const FACE_SHAPE_VALUES = [
  FACE_SHAPE.OVAL,
  FACE_SHAPE.DIAMOND,
  FACE_SHAPE.HEART,
  FACE_SHAPE.PEANUT,
  FACE_SHAPE.HEXAGONAL,
  FACE_SHAPE.ROUND,
] as const;

const HAIR_TYPE_VALUES = [
  HAIR_TYPE.MALIGNANT_CURLY,
  HAIR_TYPE.CURLY,
  HAIR_TYPE.SEMI_CURLY,
  HAIR_TYPE.STRAIGHT,
] as const;

const BANG_TYLE_VALUES = [
  BANG_STYLE.ALL,
  BANG_STYLE.COVERED_FOREHEAD,
  BANG_STYLE.EXPOSED_FOREHEAD,
  BANG_STYLE.NO_BANGS,
  BANG_STYLE.SIDE_SWEPT_BANGS,
  BANG_STYLE.STRAIGHT_BANGS,
  BANG_STYLE.ALL,
] as const;

export const consultingResponseFormSchema = z.object({
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.FACE_SHAPE]: z.enum(FACE_SHAPE_VALUES),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_TYPE]: z.enum(HAIR_TYPE_VALUES).nullable().optional(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option3]: z.number().nullable().optional(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option4]: z.enum(BANG_TYLE_VALUES).nullable().optional(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option5]: z.object({
    images: z.array(z.instanceof(File)),
    description: z.string().optional(),
  }),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option6]: z.array(
    z.object({
      operationName: z.string(),
      minPrice: z.number(),
      maxPrice: z.number(),
    }),
  ),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.option7]: z.string().optional(),
});

export type ConsultingResponseFormValues = z.infer<typeof consultingResponseFormSchema>;
