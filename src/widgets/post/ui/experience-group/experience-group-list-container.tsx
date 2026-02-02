import ExperienceGroupList from '@/features/posts/ui/post-list/experience-group-list';
import type { PostListTab } from '@/features/posts/types/post-list-tab';
import type { SelectedRegion } from '@/features/region/types/selected-region';
import { useCallback } from 'react';
import useGetExperienceGroups from '@/features/posts/api/use-get-experience-groups';

type ExperienceGroupListContainerProps = {
  activePostListTab: PostListTab;
  userSelectedRegionData: SelectedRegion | null;
};
export default function ExperienceGroupListContainer({
  activePostListTab,
  userSelectedRegionData,
}: ExperienceGroupListContainerProps) {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetExperienceGroups({
    isMine: activePostListTab === 'my',
    selectedRegion: userSelectedRegionData,
  });

  const experienceGroups = data?.pages.flatMap((page) => page.dataList);

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!experienceGroups) return null;

  return (
    <ExperienceGroupList
      experienceGroups={experienceGroups}
      tab={activePostListTab}
      fetchNextPage={handleFetchNextPage}
    />
  );
}
