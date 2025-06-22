'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { useNavigation } from '@/shared';
import {
  CreateHairConsultPostingRequest,
  CreateHairConsultPostingResponse,
  HairConsultPostingFavoriteResponse,
  ImageUploadResponse,
} from '@/entities/posts';

export function useCreatePostMutation() {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  return useMutation({
    mutationFn: (data: CreateHairConsultPostingRequest) =>
      apiClient.post<CreateHairConsultPostingResponse>('hair-consult-postings', data),
    onSuccess: () => {
      navigation.toPosts();
      queryClient.invalidateQueries({ queryKey: ['hair-consult-postings'] });
    },
  });
}

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

export function useUploadPostImageMutation() {
  return useMutation({
    mutationFn: (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      return apiClient.postFormData<ImageUploadResponse>(
        'uploads/hair-consult-postings/images',
        formData,
      );
    },
  });
}
