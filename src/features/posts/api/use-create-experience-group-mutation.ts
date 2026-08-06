import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateExperienceGroupRequest } from '@/entities/posts/api/create-experience-group-request';
import type { CreateExperienceGroupResponse } from '@/entities/posts/api/create-experience-group-response';
import { apiClient } from '@/shared/api/client';

import { getExperienceListQueryKeyPrefix } from './use-get-experience-groups';
import { EXPERIENCE_GROUP_API_PREFIX } from '../constants/api';

type CreateExperienceGroupMutationCallbacks = {
  onSuccess: () => void;
  onError?: (error: unknown) => void;
};

export default function useCreateExperienceGroupMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    meta: { skipGlobalError: true },
    mutationFn: (data: CreateExperienceGroupRequest) =>
      apiClient.post<CreateExperienceGroupResponse>(`${EXPERIENCE_GROUP_API_PREFIX}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getExperienceListQueryKeyPrefix()] });
    },
  });

  const mutate = (
    data: CreateExperienceGroupRequest,
    { onSuccess, onError }: CreateExperienceGroupMutationCallbacks,
  ) => {
    mutation.mutate(data, {
      onSuccess,
      onError,
    });
  };

  return {
    mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
