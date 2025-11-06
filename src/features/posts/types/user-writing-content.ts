import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';

import type { ConsultingPostFormValues } from './consulting-post-form-values';
import type { ConsultingResponseFormValues } from './consulting-response-form-values';
import type { ExperienceGroupFormValues } from './experience-group-form-values';

export type WritingStep<
  T extends ConsultingPostFormValues | ConsultingResponseFormValues | ExperienceGroupFormValues,
> = {
  step: number;
  content: T;
} | null;

export type UserWritingContent = {
  [USER_WRITING_CONTENT_KEYS.consultingPost]: WritingStep<ConsultingPostFormValues>;
  [USER_WRITING_CONTENT_KEYS.consultingResponse]: WritingStep<ConsultingResponseFormValues>[];
  [USER_WRITING_CONTENT_KEYS.experienceGroup]: WritingStep<ExperienceGroupFormValues>;
};
