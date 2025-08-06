import type { ReactNode } from 'react';

import CommentIcon from '@/assets/icons/comment.svg';
import UserIcon from '@/assets/icons/lets-icons_user-duotone.svg';
import HeartIcon from '@/assets/icons/mdi_heart.svg';
import RecentIcon from '@/assets/icons/mdi_recent.svg';
import PopularIcon from '@/assets/icons/recent.svg';
import { USER_ROLE } from '@/entities/user/constants/user-role';
import type { ValueOf } from '@/shared/type/types';

import type { PostListTab } from '../types/post-list-tab';

type TabInfo = {
  id: PostListTab;
  label: string;
  icon: ReactNode;
  getEmptyText: (role: ValueOf<typeof USER_ROLE>) => string;
};

export const POST_LIST_TAB: Record<PostListTab, TabInfo> = {
  latest: {
    id: 'latest',
    label: '최신글',
    icon: <RecentIcon className="size-5 fill-label-sub group-data-[state=on]:fill-white" />,
    getEmptyText: () => '아직 게시글이 없습니다',
  },
  popular: {
    id: 'popular',
    label: '인기글',
    icon: <PopularIcon className="size-5 fill-label-sub group-data-[state=on]:fill-white" />,
    getEmptyText: () => '아직 게시글이 없습니다',
  },
  my: {
    id: 'my',
    label: '내 상담글',
    icon: <UserIcon className="size-5 fill-label-sub group-data-[state=on]:fill-white" />,
    getEmptyText: (role) => {
      switch (role) {
        case USER_ROLE.MODEL:
          return '글을 작성하고 헤어 상담을 받아보세요!';
        case USER_ROLE.DESIGNER:
          return '';
        default:
          return '';
      }
    },
  },
  comment: {
    id: 'comment',
    label: '댓글 단 글',
    icon: <CommentIcon className="size-5 p-[2px] fill-positive" />,
    getEmptyText: (role) => {
      switch (role) {
        case USER_ROLE.MODEL:
          return '아직 댓글을 단 글이 없어요';
        case USER_ROLE.DESIGNER:
          return '댓글을 달아 고객과 상담을 진행해주세요! ';
        default:
          return '';
      }
    },
  },
  favorite: {
    id: 'favorite',
    label: '좋아한 글',
    icon: <HeartIcon className="size-5 p-[1px] fill-negative-light" />,
    getEmptyText: () => '아직 좋아한 글이 없어요',
  },
} as const;

export const POST_LIST_TABS = Object.values(POST_LIST_TAB);
