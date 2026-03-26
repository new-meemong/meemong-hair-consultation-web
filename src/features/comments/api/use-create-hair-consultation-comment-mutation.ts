import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateHairConsultationCommentRequest } from '@/entities/comment/api/create-hair-consultation-comment-request';
import type { CreateHairConsultationCommentResponse } from '@/entities/comment/api/create-hair-consultation-comment-response';
import { HAIR_CONSULTATION_API_PREFIX } from '@/features/posts/constants/api';
import { apiClient, type ApiResponse } from '@/shared/api/client';
import { getHairConsultationCommentsQueryKeyPrefix } from './use-get-hair-consultation-comments';
import { getHairConsultationDetailQueryKeyPrefix } from '@/features/posts/api/use-get-hair-consultation-detail';
import { getHairConsultationsQueryKeyPrefix } from '@/features/posts/api/use-get-hair-consultations';
import { useOptionalBrand } from '@/shared/context/brand-context';
import { getWebUserData } from '@/shared/lib/auth';
import { createWebApiClient } from '@/shared/lib/web-api';

export default function useCreateHairConsultationCommentMutation(hairConsultationId: string) {
  const queryClient = useQueryClient();
  const brand = useOptionalBrand();

  const mutation = useMutation({
    mutationFn: async (
      data: CreateHairConsultationCommentRequest,
    ): Promise<ApiResponse<CreateHairConsultationCommentResponse>> => {
      if (brand) {
        const webToken = getWebUserData(brand.config.slug)?.token;
        if (webToken) {
          const result = await createWebApiClient(
            webToken,
            brand.config.slug,
          ).post<CreateHairConsultationCommentResponse>(
            `${HAIR_CONSULTATION_API_PREFIX}/${hairConsultationId}/comments`,
            data,
          );
          return { data: result, success: true };
        }
      }
      return apiClient.post<CreateHairConsultationCommentResponse>(
        `${HAIR_CONSULTATION_API_PREFIX}/${hairConsultationId}/comments`,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [getHairConsultationDetailQueryKeyPrefix(hairConsultationId)],
      });
      queryClient.invalidateQueries({
        queryKey: [getHairConsultationCommentsQueryKeyPrefix(hairConsultationId)],
      });
      queryClient.invalidateQueries({ queryKey: [getHairConsultationsQueryKeyPrefix()] });
    },
  });

  const mutate = (
    data: CreateHairConsultationCommentRequest,
    {
      onSuccess,
      onError,
    }: {
      onSuccess: (response: ApiResponse<CreateHairConsultationCommentResponse>) => void;
      onError?: (error: unknown) => void;
    },
  ) => {
    mutation.mutate(data, {
      onSuccess: (response) => {
        onSuccess(response);
      },
      onError,
    });
  };

  return {
    mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
