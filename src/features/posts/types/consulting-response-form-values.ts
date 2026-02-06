import { z } from 'zod';

import { BANG_STYLE } from '../constants/bang-style';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../constants/consulting-response-form-field-name';
import { FACE_SHAPE } from '../constants/face-shape';
import { HAIR_TYPE } from '../constants/hair-type';

const FACE_SHAPE_VALUES = [
  FACE_SHAPE.OVAL,
  FACE_SHAPE.DIAMOND,
  FACE_SHAPE.LONG,
  FACE_SHAPE.SQUARE,
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
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.POST_ID]: z.string(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.FACE_SHAPE]: z.enum(FACE_SHAPE_VALUES),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_TYPE]: z.object({
    value: z.enum(HAIR_TYPE_VALUES).nullable(),
    needStoreConsulting: z.boolean(),
  }),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.DAMAGE_LEVEL]: z.object({
    value: z.number().nullable(),
    needStoreConsulting: z.boolean(),
  }),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.BANGS_RECOMMENDATION]: z.object({
    value: z.enum(BANG_TYLE_VALUES).nullable(),
    needStoreConsulting: z.boolean(),
  }),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE]: z.object({
    imageFiles: z.array(z.instanceof(File)),
    imageUrls: z.array(z.string()),
    description: z.string().optional(),
  }),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.TREATMENTS]: z.array(
    z.object({
      treatmentName: z.string(),
      minPrice: z.number(),
      maxPrice: z.number(),
    }),
  ),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.COMMENT]: z.string().optional(),
});

export type ConsultingResponseFormValues = z.infer<typeof consultingResponseFormSchema>;
