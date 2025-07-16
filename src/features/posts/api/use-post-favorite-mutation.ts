import { apiClient } from '@/shared/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HAIR_CONSULT_POSTING_QUERY_KEY_PREFIX } from '../constants/query-keys';
import type { PostDetail } from '@/entities/posts/model/types';
import { getPostDetailQueryKey } from './use-get-post-detail';
import { GET_POSTS_ENDPOINT } from './use-get-posts';

type MutationParams = {
  hairConsultPostingId: number;
  liked: boolean;
};

export default function usePostFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hairConsultPostingId, liked }: MutationParams) => {
      const path = `${HAIR_CONSULT_POSTING_QUERY_KEY_PREFIX}/${hairConsultPostingId}/favorites`;

      if (liked) {
        return apiClient.delete(path);
      } else {
        return apiClient.post(path);
      }
    },
    onMutate: async ({ hairConsultPostingId, liked }: MutationParams) => {
      const postDetailQueryKey = getPostDetailQueryKey(hairConsultPostingId.toString());
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
        const postDetailQueryKey = getPostDetailQueryKey(hairConsultPostingId.toString());
        queryClient.setQueryData(postDetailQueryKey, context.previousPost);
      }
    },
    onSettled: async (_, __, { hairConsultPostingId }) => {
      const postDetailQueryKey = getPostDetailQueryKey(hairConsultPostingId.toString());

      await queryClient.invalidateQueries({
        queryKey: [GET_POSTS_ENDPOINT],
      });

      const response = await apiClient.get<PostDetail>(
        `${HAIR_CONSULT_POSTING_QUERY_KEY_PREFIX}/${hairConsultPostingId}`,
      );
      queryClient.setQueryData(postDetailQueryKey, response);
    },
    meta: {
      skipLoadingOverlay: true,
    },
  });
}
