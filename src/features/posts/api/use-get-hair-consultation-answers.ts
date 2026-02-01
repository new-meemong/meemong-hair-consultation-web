import { DEFAULT_LIMIT } from '@/shared/api/constants/default-limit';
import { HAIR_CONSULTATION_API_PREFIX } from '../constants/api';
import type { HairConsultationAnswer } from '@/entities/posts/model/hair-consultation-answer';
import type { PagingQueryParams } from '@/shared/api/types/paging-query-params';
import useCursorInfiniteQuery from '@/shared/api/hooks/use-cursor-infinite-query';

const getHairConsultationAnswersEndpoint = (hairConsultationId: string) =>
  `${HAIR_CONSULTATION_API_PREFIX}/${hairConsultationId}/answers`;
export const getHairConsultationAnswersQueryKeyPrefix = (hairConsultationId: string) =>
  getHairConsultationAnswersEndpoint(hairConsultationId);

export default function useGetHairConsultationAnswers(
  hairConsultationId: string,
  params: PagingQueryParams = {},
) {
  const { __limit = DEFAULT_LIMIT } = params;

  return useCursorInfiniteQuery<HairConsultationAnswer>({
    endpoint: getHairConsultationAnswersEndpoint(hairConsultationId),
    queryKey: [getHairConsultationAnswersQueryKeyPrefix(hairConsultationId), params],
    __limit,
  });
}
