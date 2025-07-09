'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { WriteButton } from '@/features/posts';
import { ToggleChip, ToggleChipGroup } from '@/shared/ui';
import { PostList } from '@/widgets/posts';
import { SiteHeader, BellButton } from '@/widgets/header';
import { BannerCarousel } from '@/widgets/banner';
import RecentIcon from '@/assets/icons/mdi_recent.svg';
import UserIcon from '@/assets/icons/lets-icons_user-duotone.svg';
import PopularIcon from '@/assets/icons/recent.svg';
import HeartIcon from '@/assets/icons/mdi_heart.svg';
import CommentIcon from '@/assets/icons/comment.svg';
import { useRouter } from 'next/navigation';
import { fetchPostsByTab } from '@/features/posts';
import { type TabType } from '@/features/posts/types/tabs';
import { BANNERS, type Post } from '@/entities/posts';
import { ROUTES } from '@/shared';
import { TAB_LABELS } from '@/features/posts/constants/tabs';

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
          <ToggleChip
            icon={<RecentIcon className="size-5 fill-label-sub group-data-[state=on]:fill-white" />}
            pressed={activeTab === 'recent'}
            onPressedChange={() => handleTabChange('recent')}
          >
            {TAB_LABELS.recent}
          </ToggleChip>
          <ToggleChip
            icon={
              <PopularIcon className="size-5 fill-label-sub group-data-[state=on]:fill-white" />
            }
            pressed={activeTab === 'popular'}
            onPressedChange={() => handleTabChange('popular')}
          >
            {TAB_LABELS.popular}
          </ToggleChip>
          <ToggleChip
            icon={<UserIcon className="size-5 fill-label-sub group-data-[state=on]:fill-white" />}
            pressed={activeTab === 'my'}
            onPressedChange={() => handleTabChange('my')}
          >
            {TAB_LABELS.my}
          </ToggleChip>
          <ToggleChip
            icon={<CommentIcon className="size-5 p-[2px] fill-positive" />}
            pressed={activeTab === 'commented'}
            onPressedChange={() => handleTabChange('commented')}
          >
            {TAB_LABELS.commented}
          </ToggleChip>
          <ToggleChip
            icon={<HeartIcon className="size-5 p-[1px] fill-negative-light" />}
            pressed={activeTab === 'liked'}
            onPressedChange={() => handleTabChange('liked')}
          >
            {TAB_LABELS.liked}
          </ToggleChip>
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
