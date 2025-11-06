import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/shared/api/client';

import { EXPERIENCE_GROUP_API_PREFIX } from '../constants/api';

import { getExperienceListQueryKeyPrefix } from './use-get-experience-groups';

export default function useCreateExperienceGroupReadingMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => apiClient.post(`${EXPERIENCE_GROUP_API_PREFIX}/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getExperienceListQueryKeyPrefix()] });
    },
  });

  const mutate = (id: number, { onSuccess }: { onSuccess: () => void }) => {
    mutation.mutate(id, { onSuccess });
  };

  return {
    mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
