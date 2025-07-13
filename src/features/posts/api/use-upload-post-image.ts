import { apiClient } from '@/shared/api/client';
import { useMutation } from '@tanstack/react-query';
import { type ImageUploadResponse } from '@/entities/posts';

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
