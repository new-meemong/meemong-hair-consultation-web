import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateHairConsultationCommentReportRequest } from '@/entities/comment/api/create-hair-consultation-comment-report-request';
import type { CreateHairConsultationCommentReportResponse } from '@/entities/comment/api/create-hair-consultation-comment-report-response';
import { HAIR_CONSULTATION_API_PREFIX } from '@/features/posts/constants/api';
import { apiClient } from '@/shared/api/client';
import { getHairConsultationCommentsQueryKeyPrefix } from './use-get-hair-consultation-comments';

type MutationParams = {
  hairConsultationId: string;
  hairConsultationCommentId: number;
  data: CreateHairConsultationCommentReportRequest;
};

export default function useCreateHairConsultationCommentReportMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ hairConsultationId, hairConsultationCommentId, data }: MutationParams) =>
      apiClient.post<CreateHairConsultationCommentReportResponse>(
        `${HAIR_CONSULTATION_API_PREFIX}/${hairConsultationId}/comments/${hairConsultationCommentId}/reports`,
        data,
      ),
    onSuccess: (_response, { hairConsultationId }) => {
      queryClient.invalidateQueries({
        queryKey: [getHairConsultationCommentsQueryKeyPrefix(hairConsultationId)],
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
