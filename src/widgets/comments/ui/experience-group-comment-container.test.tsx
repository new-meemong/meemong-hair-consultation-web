import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ExperienceGroupCommentWithReplies } from '@/entities/comment/model/experience-group-comment';
import ExperienceGroupCommentContainer from './experience-group-comment-container';

const state = vi.hoisted(() => ({
  auth: { user: { id: 20 }, isUserDesigner: true, isUserModel: false },
  comments: [] as ExperienceGroupCommentWithReplies[],
}));

vi.mock('@/features/auth/context/auth-context', () => ({
  useAuthContext: () => state.auth,
  useOptionalAuthContext: () => state.auth,
}));
vi.mock('@/features/comments/api/use-get-experience-group-comments', () => ({
  default: () => ({
    data: { pages: [{ dataList: state.comments, dataCount: state.comments.length }] },
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: vi.fn(),
  }),
}));
vi.mock('@/shared', () => ({ Button: () => null, MoreOptionsMenu: () => null, ROUTES: {} }));
vi.mock('@/shared/context/brand-context', () => ({ useOptionalBrand: () => null }));
vi.mock('@/shared/hooks/use-router-with-user', () => ({
  useRouterWithUser: () => ({ push: vi.fn() }),
}));
vi.mock('@/shared/hooks/use-intersection-observer', () => ({
  useIntersectionObserver: () => null,
}));
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams() }));
vi.mock('@/features/mong/hook/use-show-mong-consume-sheet', () => ({ default: () => vi.fn() }));
vi.mock('@/features/comments/ui/comment-author-profile', () => ({ default: () => null }));
vi.mock('@/features/comments/ui/consulting-response-button', () => ({ default: () => null }));
vi.mock('@/assets/icons/more-vertical.svg', () => ({ default: () => null }));
vi.mock('@/assets/icons/reply.svg', () => ({ default: () => null }));

const hiddenMessage = '타 디자이너의 댓글은 볼 수 없습니다';

function renderComments() {
  return render(
    <ExperienceGroupCommentContainer
      experienceGroupId="1"
      postWriterId={10}
      commentFormState={{ state: 'create', commentId: null, content: null }}
      handlers={{
        handleReplyClick: vi.fn(),
        handleDeleteComment: vi.fn(),
        handleEditComment: vi.fn(),
        handleCommentFormSubmit: vi.fn(),
        resetCommentState: vi.fn(),
      }}
    />,
  );
}

describe('체험단 댓글 공개 범위', () => {
  beforeEach(() => {
    state.auth = { user: { id: 20 }, isUserDesigner: true, isUserModel: false };
    const timestamps = { createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' };
    state.comments = [
      {
        id: 1,
        content: '내 디자이너 댓글',
        ...timestamps,
        isAnonymous: false,
        user: { id: 20, displayName: '디자이너', profilePictureURL: '', role: 2 },
        replies: [
          {
            id: 2,
            content: '게시글 작성 모델의 답글',
            ...timestamps,
            isAnonymous: false,
            user: { id: 10, displayName: '모델', profilePictureURL: '', role: 1 },
          },
        ],
      },
      {
        id: 3,
        content: '다른 디자이너 댓글',
        ...timestamps,
        isAnonymous: false,
        user: { id: 30, displayName: '다른 디자이너', profilePictureURL: '', role: 2 },
        replies: [],
      },
    ];
  });
  afterEach(cleanup);

  it.each(['role', 'Role'] as const)(
    '디자이너에게 모델 답글을 표시하고 타 디자이너 댓글은 숨긴다 (%s)',
    (roleKey) => {
      const reply = state.comments[0].replies[0];
      delete reply.user.role;
      reply.user[roleKey] = 1;
      renderComments();
      expect(screen.getByText('내 디자이너 댓글')).toBeTruthy();
      expect(screen.queryByText('게시글 작성 모델의 답글')).not.toBeNull();
      expect(screen.queryByText('다른 디자이너 댓글')).toBeNull();
      expect(screen.getAllByText(hiddenMessage)).toHaveLength(1);
    },
  );

  it('게시글 작성 모델에게 모든 댓글과 답글을 표시한다', () => {
    state.auth = { user: { id: 10 }, isUserDesigner: false, isUserModel: true };
    renderComments();
    expect(screen.getByText('내 디자이너 댓글')).toBeTruthy();
    expect(screen.getByText('게시글 작성 모델의 답글')).toBeTruthy();
    expect(screen.getByText('다른 디자이너 댓글')).toBeTruthy();
    expect(screen.queryByText(hiddenMessage)).toBeNull();
  });

  it('역할이 누락된 다른 작성자의 댓글은 기존처럼 숨긴다', () => {
    delete state.comments[1].user.role;
    renderComments();
    expect(screen.queryByText('다른 디자이너 댓글')).toBeNull();
    expect(screen.getAllByText(hiddenMessage)).toHaveLength(1);
  });
});
