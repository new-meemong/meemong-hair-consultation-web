import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ExperienceGroupDetail } from '@/entities/posts/model/experience-group-detail';
import { apiClient } from '@/shared/api/client';


import { getExperienceGroupDetailQueryKeyPrefix } from './use-get-experience-group-detail';
import { getExperienceListQueryKeyPrefix } from './use-get-experience-groups';
import { EXPERIENCE_GROUP_API_PREFIX } from '../constants/api';

type MutationParams = {
  id: number;
  liked: boolean;
};

export default function useExperienceGroupFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, liked }: MutationParams) => {
      const path = `${EXPERIENCE_GROUP_API_PREFIX}/${id}/like`;

      if (liked) {
        return apiClient.delete(path);
      } else {
        return apiClient.post(path);
      }
    },
    onMutate: async ({ id, liked }: MutationParams) => {
      const postDetailQueryKey = [getExperienceGroupDetailQueryKeyPrefix(id.toString())];
      const previousPost = queryClient.getQueryData<{ data: ExperienceGroupDetail }>(
        postDetailQueryKey,
      );

      queryClient.setQueryData<{ data: ExperienceGroupDetail }>(postDetailQueryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            isFavorited: !liked,
            likeCount: old.data.likeCount + (!liked ? 1 : -1),
          },
        };
      });

      return { previousPost };
    },
    onError: (_error, { id }, context) => {
      if (context?.previousPost) {
        const postDetailQueryKey = [getExperienceGroupDetailQueryKeyPrefix(id.toString())];
        queryClient.setQueryData(postDetailQueryKey, context.previousPost);
      }
    },
    onSettled: async (_, __, { id }) => {
      const postDetailQueryKey = [getExperienceGroupDetailQueryKeyPrefix(id.toString())];

      await queryClient.invalidateQueries({
        queryKey: [getExperienceListQueryKeyPrefix()],
      });

      const response = await apiClient.get<ExperienceGroupDetail>(
        `${EXPERIENCE_GROUP_API_PREFIX}/${id}`,
      );
      queryClient.setQueryData(postDetailQueryKey, response);
    },
    meta: {
      skipLoadingOverlay: true,
    },
  });
}
