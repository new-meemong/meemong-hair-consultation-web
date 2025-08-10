import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreatePostRequest } from '@/entities/posts/api/create-post-request';
import type { CreatePostResponse } from '@/entities/posts/api/create-post-response';
import { apiClient } from '@/shared/api/client';

import { getPostsQueryKeyPrefix } from './use-get-posts';

export default function useCreatePostMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreatePostRequest) =>
      apiClient.post<CreatePostResponse>('hair-consult-postings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getPostsQueryKeyPrefix()] });
    },
    throwOnError: false,
  });

  const mutate = (
    data: CreatePostRequest,
    { onSuccess, onError }: { onSuccess: () => void; onError: (error: unknown) => void },
  ) => {
    mutation.mutate(data, {
      onSuccess,
      onError,
    });
  };

  return {
    mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
