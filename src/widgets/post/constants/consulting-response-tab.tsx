import type { Option } from '@/shared/type/option';
import type { ValueOf } from '@/shared/type/types';
import type { ComponentType } from 'react';
import ConsultingResponseCurrentStateContainer from '../ui/consulting-response/consulting-response-current-state-container';
import ConsultingResponsePriceAndCommentContainer from '../ui/consulting-response/consulting-response-price-and-comment-container';
import ConsultingResponseRecommendStyleContainer from '../ui/consulting-response/consulting-response-recommend-style-container';

export const CONSULTING_RESPONSE_TAB = {
  CURRENT_STATE: 'currentState',
  RECOMMEND_STYLE: 'recommendStyle',
  PRICE_AND_COMMENT: 'priceAndComment',
} as const;

export const CONSULTING_RESPONSE_TAB_OPTION: Record<
  ValueOf<typeof CONSULTING_RESPONSE_TAB>,
  Option<ValueOf<typeof CONSULTING_RESPONSE_TAB>> & {
    component: ComponentType;
  }
> = {
  [CONSULTING_RESPONSE_TAB.CURRENT_STATE]: {
    value: CONSULTING_RESPONSE_TAB.CURRENT_STATE,
    label: '현재 상태',
    component: ConsultingResponseCurrentStateContainer,
  },
  [CONSULTING_RESPONSE_TAB.RECOMMEND_STYLE]: {
    value: CONSULTING_RESPONSE_TAB.RECOMMEND_STYLE,
    label: '추천 스타일',
    component: ConsultingResponseRecommendStyleContainer,
  },
  [CONSULTING_RESPONSE_TAB.PRICE_AND_COMMENT]: {
    value: CONSULTING_RESPONSE_TAB.PRICE_AND_COMMENT,
    label: '견적 및 코멘트',
    component: ConsultingResponsePriceAndCommentContainer,
  },
} as const;

export const CONSULTING_RESPONSE_TAB_OPTIONS = Object.values(CONSULTING_RESPONSE_TAB_OPTION);
