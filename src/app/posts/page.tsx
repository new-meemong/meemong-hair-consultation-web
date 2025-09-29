'use client';

import { useCallback } from 'react';

import { useAuthContext } from '@/features/auth/context/auth-context';
import TodayConsultantBannerCarousel from '@/features/auth/ui/today-consultant-banner-carousel';
import useGetPosts from '@/features/posts/api/use-get-posts';
import { POST_TABS } from '@/features/posts/constants/post-tabs';
import usePostListTab from '@/features/posts/hooks/use-post-list-tab';
import { usePostTab } from '@/features/posts/hooks/use-post-tab';
import { getPostListTabs } from '@/features/posts/lib/get-post-list-tabs';
import type { PostListTab } from '@/features/posts/types/post-list-tab';
import PostList from '@/features/posts/ui/post-list/post-list';
import { WritePostButton } from '@/features/posts/ui/write-post-button';
import { ROUTES } from '@/shared';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { POSTS_PAGE_KEY, useScrollRestoration } from '@/shared/hooks/use-scroll-restoration';
import { ToggleChip, ToggleChipGroup } from '@/shared/ui';
import Tab from '@/shared/ui/tab';
import { SiteHeader } from '@/widgets/header';

export default function PostsPage() {
  const { user, isUserModel } = useAuthContext();

  const router = useRouterWithUser();

  const [activePostTab, setActivePostTab] = usePostTab();
  const [activePostListTab, setActivePostListTab] = usePostListTab();

  const { containerRef } = useScrollRestoration(POSTS_PAGE_KEY);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetPosts({
    filter: activePostListTab,
    consultType: activePostTab,
  });

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleTabChange = (tab: PostListTab) => {
    if (activePostListTab === tab) return;

    setActivePostListTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const listTabs = getPostListTabs(user.role);

  const handleWriteButtonClick = () => {
    router.push(ROUTES.POSTS_CREATE, {
      [SEARCH_PARAMS.POST_TAB]: activePostTab,
    });
  };

  const posts = data?.pages.flatMap((page) => page.dataList);

  return (
    <div className="min-w-[375px] w-full h-screen mx-auto flex flex-col">
      {/* 헤더 */}
      <SiteHeader title="헤어상담" />
      <div className="flex flex-col gap-5 flex-1 min-h-0">
        <Tab options={POST_TABS} value={activePostTab} onChange={setActivePostTab} />
        <div ref={containerRef} className="flex flex-col gap-5 flex-1 overflow-y-auto">
          <TodayConsultantBannerCarousel />
          <div className="flex-1 flex flex-col min-h-0 gap-2">
            <div className="flex-shrink-0">
              <ToggleChipGroup className="flex overflow-x-auto scrollbar-hide px-5">
                {listTabs.map(({ id, icon, label }) => (
                  <ToggleChip
                    key={id}
                    icon={icon}
                    pressed={activePostListTab === id}
                    onPressedChange={() => handleTabChange(id)}
                  >
                    {label}
                  </ToggleChip>
                ))}
              </ToggleChipGroup>
            </div>
            {posts && (
              <PostList posts={posts} tab={activePostListTab} fetchNextPage={handleFetchNextPage} />
            )}
          </div>
        </div>
      </div>

      {/* 글쓰기 버튼 */}
      {isUserModel && (
        <div className="fixed bottom-5 right-5">
          <WritePostButton onClick={handleWriteButtonClick} />
        </div>
      )}
    </div>
  );
}
