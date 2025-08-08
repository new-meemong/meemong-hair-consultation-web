import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getPostDetailQueryKeyPrefix } from '@/features/posts/api/use-get-post-detail';
import { getPostsQueryKeyPrefix } from '@/features/posts/api/use-get-posts';
import { HAIR_CONSULT_POSTING_API_PREFIX } from '@/features/posts/constants/api';
import { apiClient } from '@/shared/api/client';

import { getGetPostCommentsQueryKeyPrefix } from './use-get-post-comments';


type PatchPostCommentRequest = {
  content: string;
};

export default function usePatchPostCommentMutation({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: PatchPostCommentRequest) => {
      return apiClient.patch(
        `${HAIR_CONSULT_POSTING_API_PREFIX}/${postId}/comments/${commentId}`,
        data,
      );
    },
  });

  const mutate = (data: PatchPostCommentRequest, { onSuccess }: { onSuccess: () => void }) => {
    mutation.mutate(data, {
      onSuccess: () => {
        onSuccess();
        queryClient.invalidateQueries({
          queryKey: [getPostDetailQueryKeyPrefix(postId)],
        });
        queryClient.invalidateQueries({
          queryKey: [getGetPostCommentsQueryKeyPrefix(postId)],
        });
        queryClient.invalidateQueries({
          queryKey: [getPostsQueryKeyPrefix()],
        });
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
