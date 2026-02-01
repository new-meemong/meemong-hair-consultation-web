import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateHairConsultationRequest } from '@/entities/posts/api/create-hair-consultation-request';
import { HAIR_CONSULTATION_API_PREFIX } from '../constants/api';
import type { UpdateHairConsultationResponse } from '@/entities/posts/api/update-hair-consultation-response';
import { apiClient } from '@/shared/api/client';
import { getHairConsultationDetailQueryKeyPrefix } from './use-get-hair-consultation-detail';
import { getHairConsultationsQueryKeyPrefix } from './use-get-hair-consultations';

type MutationParams = {
  hairConsultationId: number;
  data: CreateHairConsultationRequest;
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
