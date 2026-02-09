import { BANG_STYLE } from '../constants/bang-style';
import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../constants/consulting-response-form-field-name';
import { FACE_SHAPE } from '../constants/face-shape';
import { HAIR_TYPE } from '../constants/hair-type';
import { z } from 'zod';

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

const HAIR_LENGTH_RECOMMENDATION_VALUES = [
  '크롭',
  '숏',
  '미디엄',
  '미디엄롱',
  '롱',
  '장발',
  '숏컷',
  '단발',
  '중단발',
] as const;

const HAIR_LAYER_RECOMMENDATION_VALUES = [
  '원랭스',
  '로우 레이어드',
  '미디엄 레이어드',
  '하이 레이어드',
] as const;

const HAIR_CURL_RECOMMENDATION_VALUES = [
  '스트레이트',
  'J컬',
  'C컬',
  'CS컬',
  'S컬',
  'SS컬',
] as const;

const BANG_TYLE_VALUES = [
  BANG_STYLE.MALE_COVERED,
  BANG_STYLE.MALE_PARTED,
  BANG_STYLE.MALE_SWEPT_BACK,
  BANG_STYLE.MALE_UP,
  BANG_STYLE.FEMALE_NO_BANGS,
  BANG_STYLE.FEMALE_SIDE_CURTAIN,
  BANG_STYLE.FEMALE_SEE_THROUGH,
  BANG_STYLE.FEMALE_FULL,
  BANG_STYLE.ALL,
  BANG_STYLE.COVERED_FOREHEAD,
  BANG_STYLE.EXPOSED_FOREHEAD,
  BANG_STYLE.NO_BANGS,
  BANG_STYLE.SIDE_SWEPT_BANGS,
  BANG_STYLE.STRAIGHT_BANGS,
] as const;

export const consultingResponseFormSchema = z.object({
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.POST_ID]: z.string(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.FACE_SHAPE]: z.enum(FACE_SHAPE_VALUES),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.IS_FACE_SHAPE_ADVICE]: z.boolean().optional(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_TYPE]: z.object({
    value: z.enum(HAIR_TYPE_VALUES).nullable(),
    needStoreConsulting: z.boolean(),
  }),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LENGTHS_RECOMMENDATION]: z.object({
    values: z.array(z.enum(HAIR_LENGTH_RECOMMENDATION_VALUES)),
    needStoreConsulting: z.boolean(),
  }),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LAYERS_RECOMMENDATION]: z.object({
    values: z.array(z.enum(HAIR_LAYER_RECOMMENDATION_VALUES)),
    needStoreConsulting: z.boolean(),
  }),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_CURLS_RECOMMENDATION]: z.object({
    values: z.array(z.enum(HAIR_CURL_RECOMMENDATION_VALUES)),
    needStoreConsulting: z.boolean(),
  }),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.ANSWER_TREATMENT_NAME]: z.string(),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.ANSWER_PRICE_INFO]: z.object({
    priceType: z.enum(['SINGLE', 'RANGE']),
    singlePrice: z.number().nullable(),
    minPrice: z.number().nullable(),
    maxPrice: z.number().nullable(),
  }),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.DAMAGE_LEVEL]: z.object({
    value: z.number().nullable(),
    needStoreConsulting: z.boolean(),
  }),
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.BANGS_RECOMMENDATION]: z.object({
    value: z.enum(BANG_TYLE_VALUES).nullable(),
    values: z.array(z.enum(BANG_TYLE_VALUES)),
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
