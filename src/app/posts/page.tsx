'use client';

import TodayConsultantBanner from '@/features/auth/ui/today-consultant-banner';
import useGetPosts from '@/features/posts/api/use-get-posts';
import { getPostTabs } from '@/features/posts/lib/get-post-tabs';
import type { PostListTab } from '@/features/posts/types/post-list-tab';
import PostList from '@/features/posts/ui/post-list';
import { WritePostButton } from '@/features/posts/ui/write-post-button';
import { ROUTES } from '@/shared';
import { useAuthContext } from '@/shared/context/auth-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { ToggleChip, ToggleChipGroup } from '@/shared/ui';
import { BellButton, SiteHeader } from '@/widgets/header';
import { useCallback, useState } from 'react';

const TODAY_CONSULTANT_BANNERS = [
  {
    id: 1,
    rank: 1,
    name: '김혜정',
    avatarUrl: 'https://picsum.photos/200/300',
    shop: '아이디헤어문정점',
  },
  {
    id: 2,
    rank: 2,
    name: '김혜정2',
    avatarUrl: 'https://picsum.photos/200/300',
    shop: '아이디헤어문정점2',
  },
  {
    id: 3,
    rank: 3,
    name: '김혜정2',
    avatarUrl: 'https://picsum.photos/200/300',
    shop: '아이디헤어문정점3',
  },
];

const POST_LIMIT = 20;

export default function PostsPage() {
  const { user, isUserModel } = useAuthContext();
  const [activeTab, setActiveTab] = useState<PostListTab>('latest');
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

  const handleTabChange = (tab: PostListTab) => {
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

      <div className="flex flex-col gap-5 flex-1 min-h-0">
        <TodayConsultantBanner banners={TODAY_CONSULTANT_BANNERS} />
        <div className="flex-1 flex flex-col min-h-0 gap-2">
          <div className="flex-shrink-0">
            <ToggleChipGroup className="flex overflow-x-auto scrollbar-hide px-5">
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
          {posts && <PostList posts={posts} tab={activeTab} fetchNextPage={handleFetchNextPage} />}
        </div>
      </div>

      {/* 글쓰기 버튼 */}
      {isUserModel && (
        <div className="fixed bottom-13.5 right-5">
          <WritePostButton onClick={handleWriteButtonClick} />
        </div>
      )}
    </div>
  );
}
