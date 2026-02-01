import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateHairConsultationFavoriteResponse } from '@/entities/posts/api/create-hair-consultation-favorite-response';
import { HAIR_CONSULTATION_API_PREFIX } from '../constants/api';
import { apiClient } from '@/shared/api/client';
import { getHairConsultationDetailQueryKeyPrefix } from './use-get-hair-consultation-detail';
import { getHairConsultationsQueryKeyPrefix } from './use-get-hair-consultations';

export default function useCreateHairConsultationFavoriteMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (hairConsultationId: number) =>
      apiClient.post<CreateHairConsultationFavoriteResponse>(
        `${HAIR_CONSULTATION_API_PREFIX}/${hairConsultationId}/favorites`,
      ),
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
