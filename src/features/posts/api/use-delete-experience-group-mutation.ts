import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/shared/api/client';

import { EXPERIENCE_GROUP_API_PREFIX } from '../constants/api';

import { getExperienceListQueryKeyPrefix } from './use-get-experience-groups';

export default function useDeleteExperienceGroupMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (experienceGroupId: number) =>
      apiClient.delete(`${EXPERIENCE_GROUP_API_PREFIX}/${experienceGroupId}`),
  });

  const mutate = (experienceGroupId: number, { onSuccess }: { onSuccess: () => void }) => {
    mutation.mutate(experienceGroupId, {
      onSuccess: () => {
        onSuccess();
        queryClient.invalidateQueries({
          queryKey: [getExperienceListQueryKeyPrefix()],
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
