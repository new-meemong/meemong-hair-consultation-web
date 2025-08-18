import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateConsultingPostRequest } from '@/entities/posts/api/create-consulting-post-request';
import type { CreateConsultingPostResponse } from '@/entities/posts/api/create-consulting-post-response';
import { apiClient } from '@/shared/api/client';

import { HAIR_CONSULT_POSTING_API_PREFIX } from '../constants/api';

import { getPostsQueryKeyPrefix } from './use-get-posts';

export default function useCreateConsultingPostMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateConsultingPostRequest) =>
      apiClient.post<CreateConsultingPostResponse>(
        `${HAIR_CONSULT_POSTING_API_PREFIX}/consultings`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getPostsQueryKeyPrefix()] });
    },
  });

  const mutate = (data: CreateConsultingPostRequest, { onSuccess }: { onSuccess: () => void }) => {
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
