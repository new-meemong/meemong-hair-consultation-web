import type {
  CreateHairConsultPostingRequest,
  CreateHairConsultPostingResponse,
} from '@/entities/posts';
import { apiClient } from '@/shared/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_POSTS_ENDPOINT } from './use-get-posts';

export function useCreatePostMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateHairConsultPostingRequest) =>
      apiClient.post<CreateHairConsultPostingResponse>('hair-consult-postings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_POSTS_ENDPOINT] });
    },
  });

  const mutate = (
    data: CreateHairConsultPostingRequest,
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
