import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateExperienceGroupCommentRequest } from '@/entities/comment/api/create-experience-group-comment-request';
import { getExperienceGroupDetailQueryKeyPrefix } from '@/features/posts/api/use-get-experience-group-detail';
import { getExperienceListQueryKeyPrefix } from '@/features/posts/api/use-get-experience-groups';
import { EXPERIENCE_GROUP_COMMENT_API_PREFIX } from '@/features/posts/constants/api';
import { apiClient } from '@/shared/api/client';

import { getGetExperienceGroupCommentsQueryKeyPrefix } from './use-get-experience-group-comments';

export default function useCreateExperienceGroupCommentMutation({
  experienceGroupId,
}: {
  experienceGroupId: string;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateExperienceGroupCommentRequest) =>
      apiClient.post(`${EXPERIENCE_GROUP_COMMENT_API_PREFIX}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [getExperienceGroupDetailQueryKeyPrefix(experienceGroupId)],
      });
      queryClient.invalidateQueries({
        queryKey: [getGetExperienceGroupCommentsQueryKeyPrefix()],
      });
      queryClient.invalidateQueries({ queryKey: [getExperienceListQueryKeyPrefix()] });
    },
  });

  const mutate = (
    data: CreateExperienceGroupCommentRequest,
    { onSuccess }: { onSuccess: () => void },
  ) => {
    mutation.mutate(data, {
      onSuccess,
    });
  };

  return {
    mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
