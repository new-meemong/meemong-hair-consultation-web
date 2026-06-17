import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateHairConsultationRequest } from '@/entities/posts/api/create-hair-consultation-request';
import type { CreateHairConsultationResponse } from '@/entities/posts/api/create-hair-consultation-response';
import { HAIR_CONSULTATION_API_PREFIX } from '../constants/api';
import { apiClient } from '@/shared/api/client';
import { getHairConsultationsQueryKeyPrefix } from './use-get-hair-consultations';

export default function useCreateHairConsultationMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    meta: { skipGlobalError: true },
    mutationFn: (data: CreateHairConsultationRequest) =>
      apiClient.post<CreateHairConsultationResponse>(`${HAIR_CONSULTATION_API_PREFIX}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getHairConsultationsQueryKeyPrefix()] });
    },
  });

  const mutate = async (
    data: CreateHairConsultationRequest,
    {
      onSuccess,
      onError,
    }: {
      onSuccess: (response: CreateHairConsultationResponse | null) => void;
      onError?: (error: unknown) => void;
    },
  ) => {
    try {
      const response = await mutation.mutateAsync(data);
      onSuccess(response.data ?? null);
    } catch (error) {
      onError?.(error);
    }
  };

  return {
    mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
