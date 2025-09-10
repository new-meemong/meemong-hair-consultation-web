import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateConsultingResponseRequest } from '@/entities/posts/api/create-consulting-response-request';
import type { CreateConsultingResponseResponse } from '@/entities/posts/api/create-consultinng-response-response';
import { getGetPostCommentsQueryKeyPrefix } from '@/features/comments/api/use-get-post-comments';
import { apiClient } from '@/shared/api/client';

import { HAIR_CONSULT_POSTING_API_PREFIX } from '../constants/api';

import { getPostDetailQueryKeyPrefix } from './use-get-post-detail';
import { getPostsQueryKeyPrefix } from './use-get-posts';

export default function useCreateConsultingResponseMutation(hairConsultPostingId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateConsultingResponseRequest) =>
      apiClient.post<CreateConsultingResponseResponse>(
        `${HAIR_CONSULT_POSTING_API_PREFIX}/${hairConsultPostingId}/consulting-answer`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [getPostDetailQueryKeyPrefix(hairConsultPostingId)],
      });
      queryClient.invalidateQueries({
        queryKey: [getGetPostCommentsQueryKeyPrefix(hairConsultPostingId)],
      });
      queryClient.invalidateQueries({ queryKey: [getPostsQueryKeyPrefix()] });
    },
  });

  const mutate = (
    data: CreateConsultingResponseRequest,
    { onSuccess }: { onSuccess: () => void },
  ) => {
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
