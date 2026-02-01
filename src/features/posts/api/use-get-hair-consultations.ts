import { DEFAULT_LIMIT } from '@/shared/api/constants/default-limit';
import { HAIR_CONSULTATION_API_PREFIX } from '../constants/api';
import type { HairConsultationListItem } from '@/entities/posts/model/hair-consultation-list-item';
import type { PagingQueryParams } from '@/shared/api/types/paging-query-params';
import useCursorInfiniteQuery from '@/shared/api/hooks/use-cursor-infinite-query';

const GET_HAIR_CONSULTATIONS_ENDPOINT = `${HAIR_CONSULTATION_API_PREFIX}`;
export const getHairConsultationsQueryKeyPrefix = () => GET_HAIR_CONSULTATIONS_ENDPOINT;

type HairConsultationOrderColumn =
  | 'contentUpdatedAt'
  | 'createdAt'
  | 'popular'
  | 'commentCountAndCreatedAt'
  | 'comment36LastUpdatedAt';

type HairConsultationListQueryParams = PagingQueryParams & {
  __orderColumn?: HairConsultationOrderColumn;
  __order?: 'asc' | 'desc';
  addresses?: string[];
  distance?: number;
  lat?: number;
  lng?: number;
  createdInsideDurationDays?: number;
  isRead?: boolean;
  isMine?: boolean;
  isMineComment?: boolean;
  isMineFavorite?: boolean;
};

export default function useGetHairConsultations(params: HairConsultationListQueryParams) {
  const { __limit = DEFAULT_LIMIT, ...rest } = params;

  return useCursorInfiniteQuery<HairConsultationListItem>({
    endpoint: GET_HAIR_CONSULTATIONS_ENDPOINT,
    queryKey: [getHairConsultationsQueryKeyPrefix(), params],
    __limit,
    additionalParams: rest,
  });
}
