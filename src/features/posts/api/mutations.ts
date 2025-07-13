'use client';

import { type HairConsultPostingFavoriteResponse } from '@/entities/posts';
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

export function usePostFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hairConsultPostingId,
      isLiked,
    }: {
      hairConsultPostingId: number;
      isLiked: boolean;
    }) => {
      if (isLiked) {
        return apiClient.delete(`hair-consult-postings/${hairConsultPostingId}/favorites`);
      } else {
        return apiClient.post<HairConsultPostingFavoriteResponse>(
          `hair-consult-postings/${hairConsultPostingId}/favorites`,
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['hair-consult-posting', variables.hairConsultPostingId],
      });
      queryClient.invalidateQueries({
        queryKey: ['hair-consult-postings'],
      });
    },
  });
}
