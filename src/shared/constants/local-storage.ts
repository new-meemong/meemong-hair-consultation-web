export const WEB_USER_DATA_KEY = (slug: string) => `web_user_data:${slug}`;
export const WEB_HAIR_CONSULTATION_CONTENT_KEY = 'web_writing_content_hairConsultation';

export const USER_GUIDE_KEYS = {
  hasSeenCreatePostGuide: 'hasSeenCreatePostGuide',
  hasSeenDesignerOnboardingGuide: 'hasSeenDesignerOnboardingGuide',
  hasSeenConsultingResponseSidebarGuide: 'hasSeenConsultingResponseSidebarGuide',
  hasSeenHairConsultationOnboardingModel: 'hasSeenHairConsultationOnboardingModel',
  hasSeenHairConsultationOnboardingDesigner: 'hasSeenHairConsultationOnboardingDesigner',
} as const;

export const USER_WRITING_CONTENT_KEYS = {
  consultingPost: 'consultingPost',
  hairConsultation: 'hairConsultation',
  consultingResponse: 'consultingResponse',
  experienceGroup: 'experienceGroup',
} as const;
