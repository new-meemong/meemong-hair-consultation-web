import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { PostDetail } from '@/entities/posts/model/post-detail';
import { apiClient } from '@/shared/api/client';


import { getPostDetailQueryKeyPrefix } from './use-get-post-detail';
import { getPostsQueryKeyPrefix } from './use-get-posts';
import { HAIR_CONSULT_POSTING_API_PREFIX } from '../constants/api';

type MutationParams = {
  hairConsultPostingId: number;
  liked: boolean;
};

export default function usePostFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hairConsultPostingId, liked }: MutationParams) => {
      const path = `${HAIR_CONSULT_POSTING_API_PREFIX}/${hairConsultPostingId}/favorites`;

      if (liked) {
        return apiClient.delete(path);
      } else {
        return apiClient.post(path);
      }
    },
    onMutate: async ({ hairConsultPostingId, liked }: MutationParams) => {
      const postDetailQueryKey = [getPostDetailQueryKeyPrefix(hairConsultPostingId.toString())];
      const previousPost = queryClient.getQueryData<{ data: PostDetail }>(postDetailQueryKey);

      queryClient.setQueryData<{ data: PostDetail }>(postDetailQueryKey, (old) => {
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
    onError: (_error, { hairConsultPostingId }, context) => {
      if (context?.previousPost) {
        const postDetailQueryKey = [getPostDetailQueryKeyPrefix(hairConsultPostingId.toString())];
        queryClient.setQueryData(postDetailQueryKey, context.previousPost);
      }
    },
    onSettled: async (_, __, { hairConsultPostingId }) => {
      const postDetailQueryKey = [getPostDetailQueryKeyPrefix(hairConsultPostingId.toString())];

      await queryClient.invalidateQueries({
        queryKey: [getPostsQueryKeyPrefix()],
      });

      const response = await apiClient.get<PostDetail>(
        `${HAIR_CONSULT_POSTING_API_PREFIX}/${hairConsultPostingId}`,
      );
      queryClient.setQueryData(postDetailQueryKey, response);
    },
    meta: {
      skipLoadingOverlay: true,
    },
  });
}
