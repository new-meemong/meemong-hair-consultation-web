import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreatePostRequest } from '@/entities/posts/api/create-post-request';
import type { CreatePostResponse } from '@/entities/posts/api/create-post-response';
import { apiClient } from '@/shared/api/client';

import { HAIR_CONSULT_POSTING_API_PREFIX } from '../constants/api';

import { getPostsQueryKeyPrefix } from './use-get-posts';

export default function useCreatePostMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreatePostRequest) =>
      apiClient.post<CreatePostResponse>(`${HAIR_CONSULT_POSTING_API_PREFIX}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getPostsQueryKeyPrefix()] });
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
