'use client';

import { BANNERS, type Post } from '@/entities/posts';
import { fetchPostsByTab, WriteButton } from '@/features/posts';
import { POST_TABS } from '@/features/posts/constants/tabs';
import { type TabType } from '@/features/posts/types/tabs';
import { ROUTES } from '@/shared';
import { ToggleChip, ToggleChipGroup } from '@/shared/ui';
import { BannerCarousel } from '@/widgets/banner';
import { BellButton, SiteHeader } from '@/widgets/header';
import { PostList } from '@/widgets/posts';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('recent');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchPostsByTab('recent');
        setPosts(data);
      } catch (error) {
        console.error('피드 데이터 로드 실패:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleTabChange = (tab: TabType) => {
    if (activeTab === tab) return;

    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    startTransition(async () => {
      const data = await fetchPostsByTab(tab);
      setPosts(data as Post[]);
    });
  };

  const handleBellClick = () => {
    console.log('알림 버튼 클릭');
  };

  return (
    <div className="min-w-[375px] w-full mx-auto pb-20">
      {/* 헤더 */}
      <SiteHeader title="헤어상담" rightComponent={<BellButton onClick={handleBellClick} />} />

      {/* 배너 캐러셀 */}
      <div className="my-4">
        <BannerCarousel banners={BANNERS} />
      </div>

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
        <PostList posts={posts} isLoading={isPending || isInitialLoading} />

        {isPending && (
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
