import { describe, expect, it } from 'vitest';

import { ChatOriginEntrySource, ChatOriginPricingType } from './chat-start-request';

describe('ChatOriginEntrySource contract', () => {
  it('matches the shared Flutter 33-value wire contract', () => {
    expect(Object.values(ChatOriginEntrySource)).toEqual([
      'MODEL_ANNOUNCEMENT_DETAIL_APPLY_CHAT',
      'QUICK_MATCHING_GENERAL_DETAIL_CHAT',
      'QUICK_MATCHING_PREMIUM_DETAIL_CHAT',
      'EXPERIENCE_GROUP_DETAIL_CHAT',
      'HAIR_CONSULTATION_POST_COMMENT_DIRECT_CHAT',
      'HAIR_CONSULTATION_POST_COMMENT_DESIGNER_PROFILE_MENU_INQUIRY',
      'HAIR_CONSULTATION_RESPONSE_DETAIL_DIRECT_CHAT',
      'HAIR_CONSULTATION_RESPONSE_DETAIL_DESIGNER_PROFILE_MENU_INQUIRY',
      'REVIEW_SPECIAL_RESERVATION_ACCEPT_CHAT',
      'JOB_POSTING_DETAIL_APPLY_CHAT',
      'RESUME_DETAIL_OFFER_CHAT',
      'MODEL_PROFILE_DIRECT_CHAT',
      'DESIGNER_PROFILE_MENU_INQUIRY',
      'QUICK_MATCHING_GENERAL_DESIGNER_PROFILE_MENU_INQUIRY',
      'QUICK_MATCHING_PREMIUM_DESIGNER_PROFILE_MENU_INQUIRY',
      'RECENT_ACCESS_RECOMMENDED_MODEL_PROFILE_CHAT',
      'NEW_MODEL_PROFILE_CHAT',
      'RECENT_FEMALE_MODEL_PROFILE_CHAT',
      'RECENT_MALE_MODEL_PROFILE_CHAT',
      'NEARBY_MODEL_PROFILE_CHAT',
      'BEAUTY_MODEL_PROFILE_CHAT',
      'ACTIVE_MODEL_PROFILE_CHAT',
      'FAVORITE_MODEL_PROFILE_CHAT',
      'QUICK_MATCHING_GENERAL_MODEL_PROFILE_CHAT',
      'QUICK_MATCHING_PREMIUM_MODEL_PROFILE_CHAT',
      'TOP_ADVISOR_DESIGNER_PROFILE_MENU_INQUIRY',
      'RECOMMENDER_DESIGNER_PROFILE_MENU_INQUIRY',
      'NO_FACE_SHOOTING_DESIGNER_PROFILE_MENU_INQUIRY',
      'SEARCH_MAP_DESIGNER_PROFILE_MENU_INQUIRY',
      'FAVORITE_NOTIFICATION_MODEL_PROFILE_CHAT',
      'HAIR_CONSULTATION_ANSWER_NOTIFICATION_MODEL_PROFILE_CHAT',
      'STORELINK_NOTIFICATION_MODEL_PROFILE_CHAT',
      'INSTAGRAM_NOTIFICATION_MODEL_PROFILE_CHAT',
    ]);
  });

  it('matches the shared Flutter pricing wire contract', () => {
    expect(Object.values(ChatOriginPricingType)).toEqual([
      'pay',
      'new',
      'recent_male',
      'recent_female',
      'longTime',
      'beauty',
      'favorite',
      'thunder_default',
      'favorite_notification_designer',
      'view_hair_consultation_answer_notification_designer',
      'view_storelink_notification_designer',
      'view_instagram_notification_designer',
    ]);
  });
});
