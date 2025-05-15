import type { CommentWithReplies, User } from '@/entities/comment';

export const CURRENT_USER: User = {
  id: 'current-user',
  name: '내이름은익명',
  avatarUrl: '',
};

export const MOCK_COMMENTS: CommentWithReplies[] = [
  {
    id: '1',
    content:
      '미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?',
    author: { id: 'user1', name: '내이름은익명', avatarUrl: '' },
    createdAt: '2024-03-31T09:00:00Z',
    isPrivate: false,
    replies: [
      {
        id: '1-1',
        content:
          '미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도',
        author: { id: 'user1', name: '내이름은익명', avatarUrl: '' },
        createdAt: '2024-03-31T09:00:00Z',
        isPrivate: false,
        parentId: '1',
      },
    ],
  },
  {
    id: '2',
    content: '비밀댓글입니다',
    author: { id: 'user2', name: '비밀댓글입니다', avatarUrl: '' },
    createdAt: '2024-03-31T09:00:00Z',
    isPrivate: true,
    replies: [
      {
        id: '2-1',
        content: '비밀댓글입니다',
        author: { id: 'user2', name: '비밀댓글입니다', avatarUrl: '' },
        createdAt: '2024-03-31T09:00:00Z',
        isPrivate: true,
        parentId: '2',
      },
    ],
  },
  {
    id: '3',
    content:
      '미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?미용실에서 이정도 머리는 얼마인가요? 미용실에서 이정도 머리는 얼마인가요?',
    author: { id: 'current-user', name: '내이름은익명', avatarUrl: '' },
    createdAt: '2024-03-31T09:00:00Z',
    isPrivate: false,
    replies: [],
  },
];
