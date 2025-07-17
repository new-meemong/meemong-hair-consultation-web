import type { PutPostRequest } from '@/entities/posts/api/put-post-request';
import { apiClient } from '@/shared/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HAIR_CONSULT_POSTING_API_PREFIX } from '../constants/api';
import { getPostDetailQueryKey } from './use-get-post-detail';
import { getPostsQueryKey } from './use-get-posts';

export default function usePutPostMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: PutPostRequest) =>
      apiClient.put(`${HAIR_CONSULT_POSTING_API_PREFIX}/${data.hairConsultPostingId}`, data),
  });

  const mutate = (data: PutPostRequest, { onSuccess }: { onSuccess: () => void }) => {
    mutation.mutate(data, {
      onSuccess: () => {
        onSuccess();
        queryClient.invalidateQueries({
          queryKey: getPostDetailQueryKey(data.hairConsultPostingId.toString()),
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
