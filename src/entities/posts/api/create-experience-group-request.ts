import type { EXPERIENCE_GROUP_PRICE_TYPE } from '@/features/posts/constants/experience-group-price-type';
import type { ValueOf } from '@/shared/type/types';

export type CreateExperienceGroupRequest = {
  priceType: ValueOf<typeof EXPERIENCE_GROUP_PRICE_TYPE>;
  title: string;
  content: string;
  price?: number;
  snsTypes?: {
    snsType: string;
    url: string;
  }[];
};
