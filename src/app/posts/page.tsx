'use client';

import { WriteButton } from '@/features/posts';
import { useGetPosts } from '@/features/posts/api/use-get-posts';
import { POST_TABS } from '@/features/posts/constants/tabs';
import { type TabType } from '@/features/posts/types/tabs';
import { ROUTES } from '@/shared';
import { ToggleChip, ToggleChipGroup } from '@/shared/ui';
import { BellButton, SiteHeader } from '@/widgets/header';
import { PostList } from '@/widgets/posts/ui/post-list';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const POST_LIMIT = 20;

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('latest');
  const router = useRouter();

  const { data: response, isLoading } = useGetPosts({ __limit: POST_LIMIT, filter: activeTab });
  const posts = response?.data.hairConsultPostingList;

  const handleTabChange = (tab: TabType) => {
    if (activeTab === tab) return;

    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBellClick = () => {
    console.log('알림 버튼 클릭');
  };

  return (
    <div className="min-w-[375px] w-full mx-auto pb-20">
      {/* 헤더 */}
      <SiteHeader title="헤어상담" rightComponent={<BellButton onClick={handleBellClick} />} />

      {/* 배너 캐러셀 */}
      {/* <div className="my-4">
        <BannerCarousel banners={BANNERS} />
      </div> */}

      {/* 탭 */}
      <div className="px-5 py-2">
        <ToggleChipGroup className="flex overflow-x-auto scrollbar-hide">
          {POST_TABS.map(({ id, icon, label }) => (
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
      <div className="relative">
        {posts && <PostList posts={posts} tab={activeTab} isLoading={isLoading} />}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full progress-bar-animation relative" />
          </div>
        )}
      </div>

      {/* 글쓰기 버튼 */}
      <div className="fixed bottom-10 right-0 left-0 mx-auto w-max">
        <WriteButton onClick={() => router.push(ROUTES.POSTS_CREATE)} />
      </div>
    </div>
  );
}
