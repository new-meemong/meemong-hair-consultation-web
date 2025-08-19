import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';

import type { ConsultingPostFormValues } from './consulting-post-form-values';

export type UserWritingContent = {
  [USER_WRITING_CONTENT_KEYS.consultingPost]: ConsultingPostFormValues | null;
};
