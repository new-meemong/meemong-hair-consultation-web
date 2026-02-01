import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateHairConsultationAnswerRequest } from '@/entities/posts/api/create-hair-consultation-answer-request';
import type { CreateHairConsultationAnswerResponse } from '@/entities/posts/api/create-hair-consultation-answer-response';
import { HAIR_CONSULTATION_API_PREFIX } from '../constants/api';
import { apiClient } from '@/shared/api/client';
import { getHairConsultationDetailQueryKeyPrefix } from './use-get-hair-consultation-detail';
import { getHairConsultationsQueryKeyPrefix } from './use-get-hair-consultations';

export default function useCreateHairConsultationAnswerMutation(hairConsultationId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateHairConsultationAnswerRequest) =>
      apiClient.post<CreateHairConsultationAnswerResponse>(
        `${HAIR_CONSULTATION_API_PREFIX}/${hairConsultationId}/answers`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [getHairConsultationDetailQueryKeyPrefix(hairConsultationId)],
      });
      queryClient.invalidateQueries({ queryKey: [getHairConsultationsQueryKeyPrefix()] });
    },
  });

  const mutate = (
    data: CreateHairConsultationAnswerRequest,
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
