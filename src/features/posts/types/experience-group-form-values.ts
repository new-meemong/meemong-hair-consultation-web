import z from 'zod';

import { EXPERIENCE_GROUP_FORM_FIELD_NAME } from '../constants/experience-group/experience-group-form-field-name';
import { EXPERIENCE_GROUP_PRICE_TYPE } from '../constants/experience-group-price-type';

const EXPERIENCE_GROUP_PRICE_TYPE_VALUES = [
  EXPERIENCE_GROUP_PRICE_TYPE.PAY,
  EXPERIENCE_GROUP_PRICE_TYPE.FREE,
  EXPERIENCE_GROUP_PRICE_TYPE.MATERIAL_COST,
] as const;

export const experienceGroupFormSchema = z.object({
  [EXPERIENCE_GROUP_FORM_FIELD_NAME.PRICE_TYPE]: z.enum(EXPERIENCE_GROUP_PRICE_TYPE_VALUES),
  [EXPERIENCE_GROUP_FORM_FIELD_NAME.PRICE]: z.number().optional(),
  [EXPERIENCE_GROUP_FORM_FIELD_NAME.TITLE]: z.string(),
  [EXPERIENCE_GROUP_FORM_FIELD_NAME.CONTENT]: z.string(),
  [EXPERIENCE_GROUP_FORM_FIELD_NAME.SNS_TYPES]: z.array(
    z.object({
      snsType: z.string(),
      url: z.string(),
    }),
  ),
});

export type ExperienceGroupFormValues = z.infer<typeof experienceGroupFormSchema>;
