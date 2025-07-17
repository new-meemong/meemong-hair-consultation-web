import { apiClient } from '@/shared/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreatePostRequest } from '@/entities/posts/api/create-post-request';
import type { CreatePostResponse } from '@/entities/posts/api/create-post-response';
import { getPostsQueryKey } from './use-get-posts';

export default function useCreatePostMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreatePostRequest) =>
      apiClient.post<CreatePostResponse>('hair-consult-postings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getPostsQueryKey() });
    },
  });

  const mutate = (data: CreatePostRequest, { onSuccess }: { onSuccess: () => void }) => {
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
