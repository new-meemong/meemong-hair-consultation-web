import type { EXPERIENCE_GROUP_PRICE_TYPE } from '@/features/posts/constants/experience-group-price-type';

import type { ValueOf } from '@/shared/type/types';

export type ExperienceGroup = {
  id: number;
  priceType: ValueOf<typeof EXPERIENCE_GROUP_PRICE_TYPE>;
  title: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    displayName: string;
    profilePictureURL: string;
    role: number;
  };
  isAnonymous: boolean;
  isLiked: boolean;
  isRead: boolean;
};
