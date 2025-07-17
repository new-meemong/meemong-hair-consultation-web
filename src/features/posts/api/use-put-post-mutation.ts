import type { CreatePostRequest } from '@/entities/posts/api/create-post-request';
import { apiClient } from '@/shared/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HAIR_CONSULT_POSTING_API_PREFIX } from '../constants/api';
import { getPostDetailQueryKey } from './use-get-post-detail';
import { getPostsQueryKey } from './use-get-posts';

export default function usePutPostMutation(postId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreatePostRequest) =>
      apiClient.put(`${HAIR_CONSULT_POSTING_API_PREFIX}/${postId}`, data),
  });

  const mutate = (data: CreatePostRequest, { onSuccess }: { onSuccess: () => void }) => {
    mutation.mutate(data, {
      onSuccess: () => {
        onSuccess();
        queryClient.invalidateQueries({
          queryKey: getPostDetailQueryKey(postId),
        });
        queryClient.invalidateQueries({
          queryKey: getPostsQueryKey(),
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
