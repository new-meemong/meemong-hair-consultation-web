'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { WriteButton } from '@/features/posts';
import { ToggleChip, ToggleChipGroup } from '@/shared/ui';
import { FeedList } from '@/widgets/feed';
import { SiteHeader, BellButton } from '@/widgets/header';
import { BannerCarousel } from '@/widgets/banner';
import RecentIcon from '@/assets/icons/mdi_recent.svg';
import UserIcon from '@/assets/icons/lets-icons_user-duotone.svg';
import PopularIcon from '@/assets/icons/recent.svg';
import HeartIcon from '@/assets/icons/mdi_heart.svg';
import CommentIcon from '@/assets/icons/comment.svg';
import { useRouter } from 'next/navigation';
import { fetchFeedsByTab, type TabType } from '@/features/feed';
import { BANNERS, type Feed } from '@/entities/feed';

const TAB_LABELS: Record<TabType, string> = {
  recent: '최신글',
  popular: '인기글',
  my: '내 상담글',
  commented: '댓글 단 글',
  liked: '좋아한 글',
};

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<TabType>('recent');
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchFeedsByTab('recent');
        setFeeds(data);
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
      const data = await fetchFeedsByTab(tab);
      setFeeds(data as Feed[]);
    });
  };

  const handleBellClick = () => {
    console.log('알림 버튼 클릭');
  };

  return (
    <div className="min-w-[375px] w-full mx-auto pb-20">
      {/* 헤더 */}
      <SiteHeader rightComponent={<BellButton onClick={handleBellClick} />} />

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

      {/* 피드 리스트 */}
      <div className="relative">
        <FeedList feeds={feeds} isLoading={isPending || isInitialLoading} />

        {isPending && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full progress-bar-animation relative" />
          </div>
        )}
      </div>

      {/* 글쓰기 버튼 */}
      <div className="fixed bottom-10 right-0 left-0 mx-auto w-max">
        <WriteButton onClick={() => router.push('/posts/create')} />
      </div>
    </div>
  );
}
