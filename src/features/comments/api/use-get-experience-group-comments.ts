import type { ExperienceGroupCommentWithReplies } from '@/entities/comment/model/experience-group-comment';

import { EXPERIENCE_GROUP_COMMENT_API_PREFIX } from '@/features/posts/constants/api';

import { DEFAULT_LIMIT } from '@/shared/api/constants/default-limit';
import useCursorInfiniteQuery from '@/shared/api/hooks/use-cursor-infinite-query';
import type { PagingQueryParams } from '@/shared/api/types/paging-query-params';

const getGetExperienceGroupCommentsEndpoint = () => `${EXPERIENCE_GROUP_COMMENT_API_PREFIX}`;
export const getGetExperienceGroupCommentsQueryKeyPrefix = () =>
  getGetExperienceGroupCommentsEndpoint();

type GetExperienceGroupCommentsQueryParams = PagingQueryParams & {
  experienceGroupId: string;
};

export default function useGetExperienceGroupComments(
  params: GetExperienceGroupCommentsQueryParams,
) {
  const { __limit = DEFAULT_LIMIT, experienceGroupId } = params;

  return useCursorInfiniteQuery<ExperienceGroupCommentWithReplies>({
    endpoint: getGetExperienceGroupCommentsEndpoint(),
    queryKey: [getGetExperienceGroupCommentsQueryKeyPrefix(), params],
    __limit,
    additionalParams: {
      experienceGroupId,
      sort: 'asc',
    },
  });
}
