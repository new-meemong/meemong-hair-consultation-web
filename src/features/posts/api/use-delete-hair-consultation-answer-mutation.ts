import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HAIR_CONSULTATION_API_PREFIX } from '../constants/api';
import { apiClient } from '@/shared/api/client';
import { getHairConsultationAnswersQueryKeyPrefix } from './use-get-hair-consultation-answers';
import { getHairConsultationDetailQueryKeyPrefix } from './use-get-hair-consultation-detail';

type MutationParams = {
  hairConsultationId: string;
  hairConsultationsAnswerId: number;
};

export default function useDeleteHairConsultationAnswerMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ hairConsultationId, hairConsultationsAnswerId }: MutationParams) =>
      apiClient.delete(
        `${HAIR_CONSULTATION_API_PREFIX}/${hairConsultationId}/answers/${hairConsultationsAnswerId}`,
      ),
    onSuccess: (_response, { hairConsultationId }) => {
      queryClient.invalidateQueries({
        queryKey: [getHairConsultationDetailQueryKeyPrefix(hairConsultationId)],
      });
      queryClient.invalidateQueries({
        queryKey: [getHairConsultationAnswersQueryKeyPrefix(hairConsultationId)],
      });
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
