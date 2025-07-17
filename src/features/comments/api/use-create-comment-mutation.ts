import type { CreateCommentRequest } from '@/entities/comment/api/create-comment-request';
import { getPostDetailQueryKey } from '@/features/posts/api/use-get-post-detail';
import { HAIR_CONSULT_POSTING_API_PREFIX } from '@/features/posts/constants/api';
import { apiClient } from '@/shared/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useCreateCommentMutation(postId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateCommentRequest) =>
      apiClient.post(`${HAIR_CONSULT_POSTING_API_PREFIX}/${postId}/comments`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getPostDetailQueryKey(postId),
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
