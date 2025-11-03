import { useCallback } from 'react';

import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import useGetPosts from '@/features/posts/api/use-get-posts';
import type { PostListTab } from '@/features/posts/types/post-list-tab';
import PostList from '@/features/posts/ui/post-list/post-list';
import type { SelectedRegion } from '@/features/region/types/selected-region';

type ConsultingPostListContainerProps = {
  activePostListTab: PostListTab;
  userSelectedRegionData: SelectedRegion | null;
};

export default function ConsultingPostListContainer({
  activePostListTab,
  userSelectedRegionData,
}: ConsultingPostListContainerProps) {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetPosts({
    filter: activePostListTab,
    consultType: CONSULT_TYPE.CONSULTING,
    selectedRegion: userSelectedRegionData,
  });

  const posts = data?.pages.flatMap((page) => page.dataList);

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!posts) return null;

  return <PostList posts={posts} tab={activePostListTab} fetchNextPage={handleFetchNextPage} />;
}
