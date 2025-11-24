import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreatePostRequest } from '@/entities/posts/api/create-post-request';
import { apiClient } from '@/shared/api/client';


import { getPostDetailQueryKeyPrefix } from './use-get-post-detail';
import { getPostsQueryKeyPrefix } from './use-get-posts';
import { HAIR_CONSULT_POSTING_API_PREFIX } from '../constants/api';

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
          queryKey: [getPostDetailQueryKeyPrefix(postId)],
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
