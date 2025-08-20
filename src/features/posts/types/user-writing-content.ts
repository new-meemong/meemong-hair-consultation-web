import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';

import type { ConsultingPostFormValues } from './consulting-post-form-values';
import type { ConsultingResponseFormValues } from './consulting-response-form-values';

export type UserWritingContent = {
  [USER_WRITING_CONTENT_KEYS.consultingPost]: ConsultingPostFormValues | null;
  [USER_WRITING_CONTENT_KEYS.consultingResponse]: ConsultingResponseFormValues | null;
};
