import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '../constants/consulting-response-form-field-name';
import type { ConsultingResponseFormValues } from '../types/consulting-response-form-values';
import { useForm } from 'react-hook-form';

const DEFAULT_FORM_VALUES: Partial<ConsultingResponseFormValues> = {
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.IS_FACE_SHAPE_ADVICE]: false,
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_TYPE]: {
    value: null,
    needStoreConsulting: false,
  },
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LENGTHS_RECOMMENDATION]: {
    values: [],
    needStoreConsulting: false,
  },
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_LAYERS_RECOMMENDATION]: {
    values: [],
    needStoreConsulting: false,
  },
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.HAIR_CURLS_RECOMMENDATION]: {
    values: [],
    needStoreConsulting: false,
  },
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.ANSWER_TREATMENT_NAME]: '',
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.ANSWER_PRICE_INFO]: {
    priceType: 'SINGLE',
    singlePrice: null,
    minPrice: null,
    maxPrice: null,
  },
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.DAMAGE_LEVEL]: {
    value: 1,
    needStoreConsulting: false,
  },
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.BANGS_RECOMMENDATION]: {
    value: null,
    values: [],
    needStoreConsulting: false,
  },
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.STYLE]: {
    imageFiles: [],
    imageUrls: [],
    description: '',
  },
  [CONSULTING_RESPONSE_FORM_FIELD_NAME.TREATMENTS]: [],
};

export default function useConsultingResponseForm({ postId }: { postId: string }) {
  const method = useForm<ConsultingResponseFormValues>({
    defaultValues: {
      ...DEFAULT_FORM_VALUES,
      [CONSULTING_RESPONSE_FORM_FIELD_NAME.POST_ID]: postId,
    },
  });

  return { method };
}
