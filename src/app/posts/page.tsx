'use client';

import { WriteButton } from '@/features/posts';
import { useGetPosts } from '@/features/posts/api/use-get-posts';
import { getPostTabs } from '@/features/posts/lib/get-post-tabs';
import type { TabType } from '@/features/posts/types/tabs';
import { ROUTES } from '@/shared';
import { useAuthContext } from '@/shared/context/auth-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { ToggleChip, ToggleChipGroup } from '@/shared/ui';
import { BellButton, SiteHeader } from '@/widgets/header';
import { PostList } from '@/widgets/posts/ui/post-list';
import { useCallback, useState } from 'react';

const POST_LIMIT = 20;

export default function PostsPage() {
  const { user, isUserModel } = useAuthContext();
  const [activeTab, setActiveTab] = useState<TabType>('latest');
  const router = useRouterWithUser();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetPosts({
    __limit: POST_LIMIT,
    filter: activeTab,
  });

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleTabChange = (tab: TabType) => {
    if (activeTab === tab) return;

    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBellClick = () => {
    console.log('알림 버튼 클릭');
  };

  const tabs = getPostTabs(user.role);

  const handleWriteButtonClick = () => {
    router.push(ROUTES.POSTS_CREATE);
  };

  const posts = data?.pages.flatMap((page) => page.data.hairConsultPostingList);

  return (
    <div className="min-w-[375px] w-full h-screen mx-auto pb-20 flex flex-col">
      {/* 헤더 */}
      <SiteHeader title="헤어상담" rightComponent={<BellButton onClick={handleBellClick} />} />

      {/* 배너 캐러셀 */}
      {/* <div className="my-4">
        <BannerCarousel banners={BANNERS} />
      </div> */}

      {/* 탭 */}
      <div className="px-5 py-2">
        <ToggleChipGroup className="flex overflow-x-auto scrollbar-hide">
          {tabs.map(({ id, icon, label }) => (
            <ToggleChip
              key={id}
              icon={icon}
              pressed={activeTab === id}
              onPressedChange={() => handleTabChange(id)}
            >
              {label}
            </ToggleChip>
          ))}
        </ToggleChipGroup>
      </div>

      {/* 게시글 리스트 */}
      {posts && <PostList posts={posts} tab={activeTab} fetchNextPage={handleFetchNextPage} />}

      {/* 글쓰기 버튼 */}
      {isUserModel && (
        <div className="fixed bottom-13.5 right-5">
          <WriteButton onClick={handleWriteButtonClick} />
        </div>
      )}
    </div>
  );
}
