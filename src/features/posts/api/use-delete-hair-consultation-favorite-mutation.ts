import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HAIR_CONSULTATION_API_PREFIX } from '../constants/api';
import { apiClient } from '@/shared/api/client';
import { getHairConsultationDetailQueryKeyPrefix } from './use-get-hair-consultation-detail';
import { getHairConsultationsQueryKeyPrefix } from './use-get-hair-consultations';

export default function useDeleteHairConsultationFavoriteMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (hairConsultationId: number) =>
      apiClient.delete(`${HAIR_CONSULTATION_API_PREFIX}/${hairConsultationId}/favorites`),
    onSuccess: (_response, hairConsultationId) => {
      queryClient.invalidateQueries({
        queryKey: [getHairConsultationsQueryKeyPrefix()],
      });
      queryClient.invalidateQueries({
        queryKey: [getHairConsultationDetailQueryKeyPrefix(hairConsultationId.toString())],
      });
    },
  });

  const mutate = (hairConsultationId: number, { onSuccess }: { onSuccess: () => void }) => {
    mutation.mutate(hairConsultationId, { onSuccess });
  };

  return {
    mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
