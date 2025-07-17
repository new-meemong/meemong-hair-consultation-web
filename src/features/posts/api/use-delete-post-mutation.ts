import { apiClient } from '@/shared/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HAIR_CONSULT_POSTING_API_PREFIX } from '../constants/api';
import { getGetPostsQueryKey } from './use-get-posts';

export default function useDeletePostMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (hairConsultPostingId: number) =>
      apiClient.delete(`${HAIR_CONSULT_POSTING_API_PREFIX}/${hairConsultPostingId}`),
  });

  const mutate = (hairConsultPostingId: number, { onSuccess }: { onSuccess: () => void }) => {
    mutation.mutate(hairConsultPostingId, {
      onSuccess: () => {
        onSuccess();
        queryClient.invalidateQueries({
          queryKey: getGetPostsQueryKey(),
        });
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
