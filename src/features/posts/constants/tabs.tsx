import { type TabType } from '../types/tabs';
import RecentIcon from '@/assets/icons/mdi_recent.svg';
import UserIcon from '@/assets/icons/lets-icons_user-duotone.svg';
import PopularIcon from '@/assets/icons/recent.svg';
import HeartIcon from '@/assets/icons/mdi_heart.svg';
import CommentIcon from '@/assets/icons/comment.svg';
import { ReactNode } from 'react';

type TabInfo = {
  id: TabType;
  label: string;
  icon: ReactNode;
};

const POST_TAB: Record<TabType, TabInfo> = {
  recent: {
    id: 'recent',
    label: '최신글',
    icon: <RecentIcon className="size-5 fill-label-sub group-data-[state=on]:fill-white" />,
  },
  popular: {
    id: 'popular',
    label: '인기글',
    icon: <PopularIcon className="size-5 fill-label-sub group-data-[state=on]:fill-white" />,
  },
  my: {
    id: 'my',
    label: '내 상담글',
    icon: <UserIcon className="size-5 fill-label-sub group-data-[state=on]:fill-white" />,
  },
  commented: {
    id: 'commented',
    label: '댓글 단 글',
    icon: <CommentIcon className="size-5 p-[2px] fill-positive" />,
  },
  liked: {
    id: 'liked',
    label: '좋아한 글',
    icon: <HeartIcon className="size-5 p-[1px] fill-negative-light" />,
  },
} as const;

export const POST_TABS = Object.values(POST_TAB);
