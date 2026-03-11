import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HAIR_CONSULTATION_API_PREFIX } from '../constants/api';
import type { UpdateHairConsultationRequest } from '@/entities/posts/api/update-hair-consultation-request';
import type { UpdateHairConsultationResponse } from '@/entities/posts/api/update-hair-consultation-response';
import { apiClient } from '@/shared/api/client';
import { getHairConsultationDetailQueryKeyPrefix } from './use-get-hair-consultation-detail';
import { getHairConsultationsQueryKeyPrefix } from './use-get-hair-consultations';

type MutationParams = {
  hairConsultationId: number;
  data: UpdateHairConsultationRequest;
};

export default function useUpdateHairConsultationMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ hairConsultationId, data }: MutationParams) =>
      apiClient.put<UpdateHairConsultationResponse>(
        `${HAIR_CONSULTATION_API_PREFIX}/${hairConsultationId}`,
        data,
      ),
    onSuccess: (_response, { hairConsultationId }) => {
      queryClient.invalidateQueries({
        queryKey: [getHairConsultationsQueryKeyPrefix()],
      });
      queryClient.invalidateQueries({
        queryKey: [getHairConsultationDetailQueryKeyPrefix(hairConsultationId.toString())],
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
