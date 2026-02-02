import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import type { Post } from '@/entities/posts';
import PostList from '@/features/posts/ui/post-list/post-list';
import type { PostListTab } from '@/features/posts/types/post-list-tab';
import type { SelectedRegion } from '@/features/region/types/selected-region';
import convertToAddresses from '@/shared/api/lib/convert-to-addresses';
import { useCallback } from 'react';
import useGetHairConsultations from '@/features/posts/api/use-get-hair-consultations';
import useGetPosts from '@/features/posts/api/use-get-posts';

type ConsultingPostListContainerProps = {
  activePostListTab: PostListTab;
  userSelectedRegionData: SelectedRegion | null;
};

export default function ConsultingPostListContainer({
  activePostListTab,
  userSelectedRegionData,
}: ConsultingPostListContainerProps) {
  const listFilterParams =
    activePostListTab === 'my'
      ? { isMine: true }
      : activePostListTab === 'comment'
        ? { isMineComment: true }
        : {};

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetHairConsultations({
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
      hairConsultPostingCreateUserName: '',
      hairConsultPostingCreateUserRegion: item.hairConsultationCreateUserRegion ?? '',
      minPaymentPrice: null,
      maxPaymentPrice: item.desiredCostPrice,
      isRead: item.isRead,
      postSource: 'new',
    })),
  );

  const shouldEnableLegacy = data ? !hasNextPage : false;
  const {
    data: legacyData,
    hasNextPage: hasLegacyNextPage,
    isFetchingNextPage: isFetchingLegacyNextPage,
    fetchNextPage: fetchLegacyNextPage,
  } = useGetPosts(
    {
      filter: activePostListTab,
      consultType: CONSULT_TYPE.CONSULTING,
      selectedRegion: userSelectedRegionData,
    },
    {
      enabled: shouldEnableLegacy,
    },
  );

  const legacyPosts = legacyData?.pages.flatMap((page) => page.dataList);

  const posts = [...(newPosts ?? []), ...(legacyPosts ?? [])];

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
      return;
    }
    if (hasLegacyNextPage && !isFetchingLegacyNextPage) {
      fetchLegacyNextPage();
    }
  }, [
    fetchLegacyNextPage,
    fetchNextPage,
    hasLegacyNextPage,
    hasNextPage,
    isFetchingLegacyNextPage,
    isFetchingNextPage,
  ]);

  if (posts.length === 0) return null;

  return <PostList posts={posts} tab={activePostListTab} fetchNextPage={handleFetchNextPage} />;
}
