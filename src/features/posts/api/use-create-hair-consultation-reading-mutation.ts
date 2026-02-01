import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HAIR_CONSULTATION_API_PREFIX } from '../constants/api';
import { apiClient } from '@/shared/api/client';
import { getHairConsultationsQueryKeyPrefix } from './use-get-hair-consultations';

export default function useCreateHairConsultationReadingMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (hairConsultationId: number) =>
      apiClient.post(`${HAIR_CONSULTATION_API_PREFIX}/${hairConsultationId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getHairConsultationsQueryKeyPrefix()] });
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
