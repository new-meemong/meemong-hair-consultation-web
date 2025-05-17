'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { WriteButton } from '@/features/posts';
import { ToggleChip, ToggleChipGroup } from '@/shared/ui';
import {
  FeedList,
  RECENT_FEEDS,
  POPULAR_FEEDS,
  MY_FEEDS,
  COMMENTED_FEEDS,
  LIKED_FEEDS,
  BANNERS,
  type Feed,
} from '@/widgets/feed';
import { SiteHeader } from '@/widgets/header';
import { BannerCarousel } from '@/widgets/banner';
import RecentIcon from '@/assets/icons/mdi_recent.svg';
import UserIcon from '@/assets/icons/lets-icons_user-duotone.svg';
import PopularIcon from '@/assets/icons/recent.svg';
import HeartIcon from '@/assets/icons/mdi_heart.svg';
import CommentIcon from '@/assets/icons/comment.svg';
import BellIcon from '@/assets/icons/bell.svg';
import { useRouter } from 'next/navigation';

type TabType = 'recent' | 'popular' | 'my' | 'commented' | 'liked';

const TAB_LABELS: Record<TabType, string> = {
  recent: '최신글',
  popular: '인기글',
  my: '내 상담글',
  commented: '댓글 단 글',
  liked: '좋아한 글',
};

const fetchFeedData = (tab: TabType) => {
  // TODO : 추후 실제 API로 변경해야함
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (tab) {
        case 'recent':
          resolve(RECENT_FEEDS);
          break;
        case 'popular':
          resolve(POPULAR_FEEDS);
          break;
        case 'my':
          resolve(MY_FEEDS);
          break;
        case 'commented':
          resolve(COMMENTED_FEEDS);
          break;
        case 'liked':
          resolve(LIKED_FEEDS);
          break;
        default:
          resolve(RECENT_FEEDS);
      }
    }, 500);
  });
};

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<TabType>('recent');
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // mocking data
  useEffect(() => {
    setFeeds(RECENT_FEEDS);
  }, []);

  const handleTabChange = (tab: TabType) => {
    if (activeTab === tab) return;

    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    startTransition(async () => {
      const data = await fetchFeedData(tab);
      setFeeds(data as Feed[]);
    });
  };

  // 알림 버튼 핸들러
  const handleBellClick = () => {
    // 알림 페이지로 이동 혹은 알림 팝업 표시 로직
    console.log('알림 버튼 클릭');
  };

  // 알림 버튼 컴포넌트
  const BellButton = () => (
    <button onClick={handleBellClick} aria-label="알림">
      <BellIcon />
    </button>
  );

  return (
    <div className="min-w-[375px] w-full mx-auto pb-20">
      {/* 헤더 */}
      <SiteHeader rightComponent={<BellButton />} />

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
        <FeedList feeds={feeds} isLoading={isPending} />

        {isPending && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full progress-bar-animation relative" />
          </div>
        )}
      </div>

      {/* 글쓰기 버튼 */}
      <div className="fixed bottom-10 right-0 left-0 mx-auto w-max">
        <WriteButton onClick={() => router.push('/write')} />
      </div>
    </div>
  );
}
