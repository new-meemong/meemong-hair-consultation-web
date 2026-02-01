import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateHairConsultationCommentRequest } from '@/entities/comment/api/create-hair-consultation-comment-request';
import type { CreateHairConsultationCommentResponse } from '@/entities/comment/api/create-hair-consultation-comment-response';
import { HAIR_CONSULTATION_API_PREFIX } from '@/features/posts/constants/api';
import { apiClient } from '@/shared/api/client';
import { getHairConsultationCommentsQueryKeyPrefix } from './use-get-hair-consultation-comments';
import { getHairConsultationDetailQueryKeyPrefix } from '@/features/posts/api/use-get-hair-consultation-detail';
import { getHairConsultationsQueryKeyPrefix } from '@/features/posts/api/use-get-hair-consultations';

export default function useCreateHairConsultationCommentMutation(hairConsultationId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateHairConsultationCommentRequest) =>
      apiClient.post<CreateHairConsultationCommentResponse>(
        `${HAIR_CONSULTATION_API_PREFIX}/${hairConsultationId}/comments`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [getHairConsultationDetailQueryKeyPrefix(hairConsultationId)],
      });
      queryClient.invalidateQueries({
        queryKey: [getHairConsultationCommentsQueryKeyPrefix(hairConsultationId)],
      });
      queryClient.invalidateQueries({ queryKey: [getHairConsultationsQueryKeyPrefix()] });
    },
  });

  const mutate = (
    data: CreateHairConsultationCommentRequest,
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
