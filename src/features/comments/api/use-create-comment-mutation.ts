import type { CreateCommentRequest } from '@/entities/comment/api/create-comment-request';
import { getPostDetailQueryKeyPrefix } from '@/features/posts/api/use-get-post-detail';
import { HAIR_CONSULT_POSTING_API_PREFIX } from '@/features/posts/constants/api';
import { apiClient } from '@/shared/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getGetPostCommentsQueryKeyPrefix } from './use-get-post-comments';

export default function useCreateCommentMutation(postId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateCommentRequest) =>
      apiClient.post(`${HAIR_CONSULT_POSTING_API_PREFIX}/${postId}/comments`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [getPostDetailQueryKeyPrefix(postId)],
      });
      queryClient.invalidateQueries({
        queryKey: [getGetPostCommentsQueryKeyPrefix(postId)],
      });
    },
  });

  const mutate = (data: CreateCommentRequest, { onSuccess }: { onSuccess: () => void }) => {
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
