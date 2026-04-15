import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HAIR_CONSULTATION_API_PREFIX } from '../constants/api';
import { getHairConsultationDetailQueryKeyPrefix } from './use-get-hair-consultation-detail';
import { getHairConsultationsQueryKeyPrefix } from './use-get-hair-consultations';
import { useContextualApiClient } from '@/shared/api/hooks/use-contextual-api-client';

export default function useDeleteHairConsultationMutation() {
  const queryClient = useQueryClient();
  const client = useContextualApiClient();

  const mutation = useMutation({
    mutationFn: (hairConsultationId: number) =>
      client.delete(`${HAIR_CONSULTATION_API_PREFIX}/${hairConsultationId}`),
  });

  const mutate = (hairConsultationId: number, { onSuccess }: { onSuccess: () => void }) => {
    mutation.mutate(hairConsultationId, {
      onSuccess: () => {
        onSuccess();
        queryClient.invalidateQueries({
          queryKey: [getHairConsultationsQueryKeyPrefix()],
        });
        const detailQueryKey = [
          getHairConsultationDetailQueryKeyPrefix(hairConsultationId.toString()),
        ];
        queryClient.cancelQueries({ queryKey: detailQueryKey });
        queryClient.removeQueries({ queryKey: detailQueryKey });
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
