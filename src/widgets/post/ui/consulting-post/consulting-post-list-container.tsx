import type { Post } from '@/entities/posts';
import { useAuthContext } from '@/features/auth/context/auth-context';
import PostList from '@/features/posts/ui/post-list/post-list';
import type { PostListTab } from '@/features/posts/types/post-list-tab';
import type { SelectedRegion } from '@/features/region/types/selected-region';
import convertToAddresses from '@/shared/api/lib/convert-to-addresses';
import { useCallback } from 'react';
import useGetHairConsultations from '@/features/posts/api/use-get-hair-consultations';

type ConsultingPostListContainerProps = {
  activePostListTab: PostListTab;
  userSelectedRegionData: SelectedRegion | null;
};

export default function ConsultingPostListContainer({
  activePostListTab,
  userSelectedRegionData,
}: ConsultingPostListContainerProps) {
  const { isUserDesigner } = useAuthContext();

  const listFilterParams =
    activePostListTab === 'my'
      ? { isMine: true }
      : activePostListTab === 'comment'
        ? { isMineComment: true }
        : {};

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetHairConsultations({
    __orderColumn: isUserDesigner ? 'createdAt' : 'comment36LastUpdatedAt',
    ...listFilterParams,
    addresses: convertToAddresses(userSelectedRegionData),
  });

  const newPosts: Post[] | undefined = data?.pages.flatMap((page) =>
    page.dataList.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      repImageUrl: '',
      viewCount: item.viewCount,
      likeCount: item.likeCount,
      commentCount: item.commentCount,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      isFavorited: item.isFavorited,
      userAddress: item.user.address ?? '',
      minPaymentPrice: null,
      maxPaymentPrice: item.desiredCostPrice,
      isRead: item.isRead,
    })),
  );

  const posts = newPosts ?? [];

  const handleFetchNextPage = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (posts.length === 0) return null;

  return <PostList posts={posts} tab={activePostListTab} fetchNextPage={handleFetchNextPage} />;
}
