import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getExperienceGroupDetailQueryKeyPrefix } from '@/features/posts/api/use-get-experience-group-detail';
import { getExperienceListQueryKeyPrefix } from '@/features/posts/api/use-get-experience-groups';
import { EXPERIENCE_GROUP_COMMENT_API_PREFIX } from '@/features/posts/constants/api';
import { apiClient } from '@/shared/api/client';

import { getGetExperienceGroupCommentsQueryKeyPrefix } from './use-get-experience-group-comments';

export default function useDeleteExperienceGroupCommentMutation(experienceGroupId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (commentId: number) =>
      apiClient.delete(`${EXPERIENCE_GROUP_COMMENT_API_PREFIX}/${commentId}`),
  });

  const mutate = (commentId: number, { onSuccess }: { onSuccess?: () => void } = {}) => {
    mutation.mutate(commentId, {
      onSuccess: () => {
        onSuccess?.();
        queryClient.invalidateQueries({
          queryKey: [getExperienceGroupDetailQueryKeyPrefix(experienceGroupId)],
        });
        queryClient.invalidateQueries({
          queryKey: [getGetExperienceGroupCommentsQueryKeyPrefix()],
        });
        queryClient.invalidateQueries({ queryKey: [getExperienceListQueryKeyPrefix()] });
      },
    });
  };

  return {
    mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
