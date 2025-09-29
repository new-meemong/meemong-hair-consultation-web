'use client';

import { useCallback, useState } from 'react';

import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import { useAuthContext } from '@/features/auth/context/auth-context';
import TodayConsultantBannerCarousel from '@/features/auth/ui/today-consultant-banner-carousel';
import useGetPosts from '@/features/posts/api/use-get-posts';
import { getPostListTabs } from '@/features/posts/lib/get-post-list-tabs';
import type { PostListTab } from '@/features/posts/types/post-list-tab';
import PostList from '@/features/posts/ui/post-list/post-list';
import { WritePostButton } from '@/features/posts/ui/write-post-button';
import { ROUTES } from '@/shared';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { POSTS_PAGE_KEY, useScrollRestoration } from '@/shared/hooks/use-scroll-restoration';
import { ToggleChip, ToggleChipGroup } from '@/shared/ui';
import { SiteHeader } from '@/widgets/header';

export default function PostsPage() {
  const { user, isUserModel } = useAuthContext();

  const router = useRouterWithUser();

  const [activeTab, setActiveTab] = useState<PostListTab>('latest');
  // const [activePostTab, setActivePostTab] = usePostTab();

  const { containerRef } = useScrollRestoration(POSTS_PAGE_KEY);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetPosts({
    filter: activeTab,
    consultType: CONSULT_TYPE.CONSULTING,
  });

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleTabChange = (tab: PostListTab) => {
    if (activeTab === tab) return;

    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const listTabs = getPostListTabs(user.role);

  const handleWriteButtonClick = () => {
    router.push(ROUTES.POSTS_CREATE);
  };

  const posts = data?.pages.flatMap((page) => page.dataList);

  return (
    <div className="min-w-[375px] w-full h-screen mx-auto flex flex-col">
      <SiteHeader title="헤어 컨설팅" />
      <div className="flex flex-col gap-5 flex-1 min-h-0">
        {/* <Tab options={POST_TABS} value={activePostTab} onChange={setActivePostTab} /> */}
        <div ref={containerRef} className="flex flex-col gap-5 flex-1 overflow-y-auto pt-5">
          <TodayConsultantBannerCarousel />
          <div className="flex-1 flex flex-col min-h-0 gap-2">
            <div className="flex-shrink-0">
              <ToggleChipGroup className="flex overflow-x-auto scrollbar-hide px-5">
                {listTabs.map(({ id, icon, label }) => (
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
            {posts && (
              <PostList posts={posts} tab={activeTab} fetchNextPage={handleFetchNextPage} />
            )}
          </div>
        </div>
      </div>

      {isUserModel && (
        <div className="fixed bottom-5 right-5">
          <WritePostButton onClick={handleWriteButtonClick} />
        </div>
      )}
    </div>
  );
}
