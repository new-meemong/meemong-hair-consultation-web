'use client';

import React from 'react';
import { WriteButton } from '@/features/posts/ui/write-button';
import { ToggleChip, ToggleChipGroup } from '@/shared/ui/toggle-chip';
import { FeedList } from '@/widgets/feed/ui/feed-list';
import { SiteHeader } from '@/widgets/header';
import { BannerCarousel } from '@/widgets/banner';
import RecentIcon from '@/assets/icons/mdi_recent.svg';
import UserIcon from '@/assets/icons/lets-icons_user-duotone.svg';
import PopularIcon from '@/assets/icons/gridicons_recent.svg';
import HeartIcon from '@/assets/icons/mdi_heart.svg';
import CommentIcon from '@/assets/icons/comment.svg';
// 샘플 데이터
const MOCK_FEEDS = [
  {
    id: '1',
    title: '제 머리 스타일 어떤가요? 저는 좀 마음에 드는...',
    content:
      '미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?',
    author: '익명',
    createdAt: '방금 전',
    views: 36,
    likes: 36,
    comments: 36,
  },
  {
    id: '2',
    title: '제 머리 스타일 어떤가요? 저는...',
    content:
      '미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?미용실에서 이정도 머리는 얼마인가요?',
    author: '익명',
    createdAt: '12분전',
    views: 36,
    likes: 36,
    comments: 36,
    imageUrl: '/sample-hair.jpg',
  },
  {
    id: '3',
    title: '제 머리 스타일 어떤가요? 저는 좀 마음에 드는...',
    content:
      '미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?',
    author: '익명',
    createdAt: '18시간 전',
    views: 36,
    likes: 36,
    comments: 36,
  },
];

// 배너 데이터
const BANNERS = [
  {
    id: '1',
    title: 'MEEMONG',
    subtitle: '우리동네 헤어상담은',
    bgColor: 'bg-emerald-500',
  },
  {
    id: '2',
    title: '헤어상담',
    subtitle: '디자이너에게 물어보세요',
    bgColor: 'bg-blue-500',
  },
  {
    id: '3',
    title: '머리 고민',
    subtitle: '다양한 스타일을 찾아보세요',
    bgColor: 'bg-purple-500',
  },
];

export default function FeedPage() {
  return (
    <div className="min-w-[375px] w-full mx-auto pb-20">
      {/* 헤더 */}
      <SiteHeader />

      {/* 배너 캐러셀 */}
      <div className="my-4">
        <BannerCarousel banners={BANNERS} />
      </div>

      {/* 탭 */}
      <div className="px-5 py-2">
        <ToggleChipGroup className="flex overflow-x-auto scrollbar-hide">
          <ToggleChip
            icon={<RecentIcon className="size-5 fill-label-sub group-data-[state=on]:fill-white" />}
            defaultPressed
          >
            최신글
          </ToggleChip>
          <ToggleChip
            icon={
              <PopularIcon className="size-5 fill-label-sub group-data-[state=on]:fill-white" />
            }
          >
            인기글
          </ToggleChip>
          <ToggleChip
            icon={<UserIcon className="size-5 fill-label-sub group-data-[state=on]:fill-white" />}
          >
            내 상담글
          </ToggleChip>
          <ToggleChip icon={<CommentIcon className="size-5 fill-positive" />}>
            댓글 단 글
          </ToggleChip>
          <ToggleChip icon={<HeartIcon className="size-5 fill-negative-light" />}>
            좋아한 글
          </ToggleChip>
        </ToggleChipGroup>
      </div>

      {/* 피드 리스트 */}
      <div>
        <FeedList feeds={MOCK_FEEDS} />
      </div>

      {/* 글쓰기 버튼 */}
      <div className="fixed bottom-10 right-0 left-0 mx-auto w-max">
        <WriteButton />
      </div>
    </div>
  );
}
