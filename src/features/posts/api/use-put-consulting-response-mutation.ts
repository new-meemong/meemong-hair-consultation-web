import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateConsultingResponseRequest } from '@/entities/posts/api/create-consulting-response-request';
import { apiClient } from '@/shared/api/client';

import { HAIR_CONSULT_POSTING_API_PREFIX } from '../constants/api';

import { getConsultingResponseEndpoint } from './use-get-consulting-response';

export default function usePutConsultingResponseMutation({
  postId,
  responseId,
}: {
  postId: string;
  responseId: string;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateConsultingResponseRequest) =>
      apiClient.put(
        `${HAIR_CONSULT_POSTING_API_PREFIX}/${postId}/consulting-answer/${responseId}`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [getConsultingResponseEndpoint(postId, responseId)],
      });
    },
  });

  const mutate = (
    data: CreateConsultingResponseRequest,
    { onSuccess }: { onSuccess: () => void },
  ) => {
    if (!responseId) return;

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
