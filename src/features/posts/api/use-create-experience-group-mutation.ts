import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateExperienceGroupRequest } from '@/entities/posts/api/create-experience-group-request';
import type { CreateExperienceGroupResponse } from '@/entities/posts/api/create-experience-group-response';
import { apiClient } from '@/shared/api/client';

import { getExperienceListQueryKeyPrefix } from './use-get-experience-groups';

export default function useCreateExperienceGroupMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateExperienceGroupRequest) =>
      apiClient.post<CreateExperienceGroupResponse>(`experience-groups`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getExperienceListQueryKeyPrefix()] });
    },
  });

  const mutate = (data: CreateExperienceGroupRequest, { onSuccess }: { onSuccess: () => void }) => {
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
