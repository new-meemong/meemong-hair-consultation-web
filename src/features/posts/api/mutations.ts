'use client';

import { apiClient } from '@/shared/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hairConsultPostingId: number) =>
      apiClient.delete(`hair-consult-postings/${hairConsultPostingId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hair-consult-postings'] });
    },
  });
}
