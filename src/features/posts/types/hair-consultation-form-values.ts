import {
  HAIR_CONSULTATION_CONCERN_OPTIONS,
  HAIR_CONSULTATION_DESIRED_DATE_TYPE_VALUES,
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

const HAIR_TREATMENT_TYPES = [
  '일반펌',
  '열펌/셋팅펌',
  '다운펌',
  '매직',
  '일반염색',
  '블랙염색',
  '탈색',
  '커트만 했어요',
  '커트/드라이만 했어요',
  '블랙빼기',
  '클리닉',
  '특수클리닉(신데렐라 등)',
] as const;

const HAIR_TREATMENT_AREAS = ['전체', '뿌리', '투톤', '앞머리', '기타'] as const;

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
        treatmentType: z.enum(HAIR_TREATMENT_TYPES),
        monthsAgo: z.number().min(0),
        isSelf: z.boolean(),
        treatmentArea: z.enum(HAIR_TREATMENT_AREAS).optional().nullable(),
        decolorizationCount: z.number().min(0).optional().nullable(),
      }),
    )
    .min(1),
  [HAIR_CONSULTATION_FORM_FIELD_NAME.TREATMENT_DETAIL]: z.string().optional(),
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
  [HAIR_CONSULTATION_FORM_FIELD_NAME.DESIRED_DATE_TYPE]: z
    .enum(HAIR_CONSULTATION_DESIRED_DATE_TYPE_VALUES)
    .optional()
    .nullable(),
  [HAIR_CONSULTATION_FORM_FIELD_NAME.DESIRED_DATE]: z.string().optional().nullable(),
  [HAIR_CONSULTATION_FORM_FIELD_NAME.CONTENT]: z.string(),
  [HAIR_CONSULTATION_FORM_FIELD_NAME.TITLE]: z.string(),
});

export type HairConsultationFormValues = z.infer<typeof hairConsultationFormSchema>;
