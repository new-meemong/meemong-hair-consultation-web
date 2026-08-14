import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ChatPostButtons from './chat-post-buttons';

const mocks = vi.hoisted(() => ({
  isUserModel: true,
  push: vi.fn(),
  showModal: vi.fn(),
  user: { id: 11, role: 1 },
}));

vi.mock('@/assets/icons/hair-chat-button-icon1.svg', () => ({ default: () => null }));
vi.mock('@/assets/icons/hair-chat-button-icon2.svg', () => ({ default: () => null }));
vi.mock('@/assets/icons/hair-chat-button-icon3.svg', () => ({ default: () => null }));

vi.mock('@/shared', () => ({
  ROUTES: {
    POSTS_DETAIL: (postId: string) => `/posts/${postId}`,
    POSTS_CONSULTING_RESPONSE: (postId: string, answerId: string) =>
      `/posts/${postId}/consulting/${answerId}`,
  },
}));

vi.mock('@/features/auth/context/auth-context', () => ({
  useAuthContext: () => ({
    user: mocks.user,
    isUserModel: mocks.isUserModel,
  }),
}));

vi.mock('@/features/posts/api/use-get-hair-consultation-detail', () => ({
  default: () => ({
    data: { data: { user: { id: 11 } } },
    isError: false,
    isLoading: false,
  }),
}));

vi.mock('@/shared/hooks/use-router-with-user', () => ({
  useRouterWithUser: () => ({ push: mocks.push }),
}));

vi.mock('@/shared/ui/hooks/use-show-modal', () => ({
  default: () => mocks.showModal,
}));

vi.mock('@/shared/lib/open-external-url', () => ({
  openExternalUrl: vi.fn(),
}));

describe('ChatPostButtons answer navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isUserModel = true;
    mocks.user = { id: 11, role: 1 };
  });

  it('모델의 받은 답변 버튼은 방 메타의 정확한 answerId를 연다', () => {
    render(<ChatPostButtons postId="100" userChannel={{ answerId: '200' }} />);

    fireEvent.click(screen.getByRole('button', { name: '받은 답변' }));

    expect(mocks.push).toHaveBeenCalledWith('/posts/100/consulting/200');
  });

  it('디자이너의 내 답변 버튼은 방 메타의 answerId를 연다', () => {
    mocks.isUserModel = false;
    mocks.user = { id: 22, role: 2 };

    render(<ChatPostButtons postId="100" userChannel={{ answerId: '300' }} />);

    fireEvent.click(screen.getByRole('button', { name: '내 답변' }));

    expect(mocks.push).toHaveBeenCalledWith('/posts/100/consulting/300');
  });
});
