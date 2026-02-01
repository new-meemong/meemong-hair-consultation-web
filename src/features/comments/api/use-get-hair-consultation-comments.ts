import { DEFAULT_LIMIT } from '@/shared/api/constants/default-limit';
import { HAIR_CONSULTATION_API_PREFIX } from '@/features/posts/constants/api';
import type { HairConsultationCommentWithReplies } from '@/entities/comment/model/hair-consultation-comment';
import type { PagingQueryParams } from '@/shared/api/types/paging-query-params';
import useCursorInfiniteQuery from '@/shared/api/hooks/use-cursor-infinite-query';

const getHairConsultationCommentsEndpoint = (hairConsultationId: string) =>
  `${HAIR_CONSULTATION_API_PREFIX}/${hairConsultationId}/comments`;
export const getHairConsultationCommentsQueryKeyPrefix = (hairConsultationId: string) =>
  getHairConsultationCommentsEndpoint(hairConsultationId);

export default function useGetHairConsultationComments(
  hairConsultationId: string,
  params: PagingQueryParams = {},
) {
  const { __limit = DEFAULT_LIMIT } = params;

  return useCursorInfiniteQuery<HairConsultationCommentWithReplies>({
    endpoint: getHairConsultationCommentsEndpoint(hairConsultationId),
    queryKey: [getHairConsultationCommentsQueryKeyPrefix(hairConsultationId), params],
    __limit,
  });
}
