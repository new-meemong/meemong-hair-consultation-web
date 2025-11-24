import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/shared/api/client';

import { getPostsQueryKeyPrefix } from './use-get-posts';
import { HAIR_CONSULT_POSTING_API_PREFIX } from '../constants/api';


export default function useCreatePostReadingMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (postId: number) =>
      apiClient.post(`${HAIR_CONSULT_POSTING_API_PREFIX}/${postId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getPostsQueryKeyPrefix()] });
    },
  });

  const mutate = (postId: number, { onSuccess }: { onSuccess: () => void }) => {
    mutation.mutate(postId, { onSuccess });
  };

  return {
    mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
