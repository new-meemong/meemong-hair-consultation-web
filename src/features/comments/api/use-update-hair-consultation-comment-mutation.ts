import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HAIR_CONSULTATION_API_PREFIX } from '@/features/posts/constants/api';
import type { UpdateHairConsultationCommentRequest } from '@/entities/comment/api/update-hair-consultation-comment-request';
import { apiClient } from '@/shared/api/client';
import { getHairConsultationCommentsQueryKeyPrefix } from './use-get-hair-consultation-comments';
import { getHairConsultationDetailQueryKeyPrefix } from '@/features/posts/api/use-get-hair-consultation-detail';
import { getHairConsultationsQueryKeyPrefix } from '@/features/posts/api/use-get-hair-consultations';

type MutationParams = {
  hairConsultationId: string;
  hairConsultationCommentId: number;
  data: UpdateHairConsultationCommentRequest;
};

export default function useUpdateHairConsultationCommentMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ hairConsultationId, hairConsultationCommentId, data }: MutationParams) =>
      apiClient.patch(
        `${HAIR_CONSULTATION_API_PREFIX}/${hairConsultationId}/comments/${hairConsultationCommentId}`,
        data,
      ),
    onSuccess: (_response, { hairConsultationId }) => {
      queryClient.invalidateQueries({
        queryKey: [getHairConsultationDetailQueryKeyPrefix(hairConsultationId)],
      });
      queryClient.invalidateQueries({
        queryKey: [getHairConsultationCommentsQueryKeyPrefix(hairConsultationId)],
      });
      queryClient.invalidateQueries({ queryKey: [getHairConsultationsQueryKeyPrefix()] });
    },
  });

  const mutate = (params: MutationParams, { onSuccess }: { onSuccess: () => void }) => {
    mutation.mutate(params, {
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
