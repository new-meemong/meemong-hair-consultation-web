import type { ConsultingPostFormValues } from './consulting-post-form-values';
import type { ConsultingResponseFormValues } from './consulting-response-form-values';
import type { ExperienceGroupFormValues } from './experience-group-form-values';
import type { HairConsultationFormValues } from './hair-consultation-form-values';
import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';

export type WritingStep<
  T extends
    | ConsultingPostFormValues
    | ConsultingResponseFormValues
    | ExperienceGroupFormValues
    | HairConsultationFormValues,
> = {
  step: number;
  content: T;
} | null;

export type UserWritingContent = {
  [USER_WRITING_CONTENT_KEYS.consultingPost]: WritingStep<ConsultingPostFormValues>;
  [USER_WRITING_CONTENT_KEYS.hairConsultation]: WritingStep<HairConsultationFormValues>;
  [USER_WRITING_CONTENT_KEYS.consultingResponse]: WritingStep<ConsultingResponseFormValues>[];
  [USER_WRITING_CONTENT_KEYS.experienceGroup]: WritingStep<ExperienceGroupFormValues>;
};
