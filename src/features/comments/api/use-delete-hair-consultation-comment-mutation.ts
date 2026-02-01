import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HAIR_CONSULTATION_API_PREFIX } from '@/features/posts/constants/api';
import { apiClient } from '@/shared/api/client';
import { getHairConsultationCommentsQueryKeyPrefix } from './use-get-hair-consultation-comments';
import { getHairConsultationDetailQueryKeyPrefix } from '@/features/posts/api/use-get-hair-consultation-detail';
import { getHairConsultationsQueryKeyPrefix } from '@/features/posts/api/use-get-hair-consultations';

type MutationParams = {
  hairConsultationId: string;
  hairConsultationCommentId: number;
};

export default function useDeleteHairConsultationCommentMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ hairConsultationId, hairConsultationCommentId }: MutationParams) =>
      apiClient.delete(
        `${HAIR_CONSULTATION_API_PREFIX}/${hairConsultationId}/comments/${hairConsultationCommentId}`,
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
