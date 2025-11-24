import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateExperienceGroupRequest } from '@/entities/posts/api/create-experience-group-request';
import { apiClient } from '@/shared/api/client';

import { getExperienceGroupDetailQueryKeyPrefix } from './use-get-experience-group-detail';
import { EXPERIENCE_GROUP_API_PREFIX } from '../constants/api';


export default function usePatchExperienceGroupMutation({
  experienceGroupId,
}: {
  experienceGroupId: string;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateExperienceGroupRequest) =>
      apiClient.patch(`${EXPERIENCE_GROUP_API_PREFIX}/${experienceGroupId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [getExperienceGroupDetailQueryKeyPrefix(experienceGroupId.toString())],
      });
    },
  });

  const mutate = (data: CreateExperienceGroupRequest, { onSuccess }: { onSuccess: () => void }) => {
    if (!experienceGroupId) return;

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
