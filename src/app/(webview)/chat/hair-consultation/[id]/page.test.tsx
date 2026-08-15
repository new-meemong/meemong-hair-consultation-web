import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import HairConsultationChatDetailPage from './page';
import { HAIR_CONSULTATION_CHAT_MESSAGE_SEND_UNAVAILABLE_ERROR } from '@/features/chat/lib/hair-consultation-chat-v2-policy';

const mocks = vi.hoisted(() => ({
  back: vi.fn(),
  clearMessages: vi.fn(),
  closeAppWebView: vi.fn(),
  resetUnreadCount: vi.fn(),
  sendMessage: vi.fn(),
  setLoading: vi.fn(),
  subscribeToMessages: vi.fn(() => vi.fn()),
  subscribeToMine: vi.fn(() => vi.fn()),
  updateChannelUserInfo: vi.fn(),
  userChannels: [] as Array<Record<string, unknown>>,
}));

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'channel-1' }),
}));

vi.mock('@/features/auth/context/auth-context', () => ({
  useAuthContext: () => ({ user: { id: 1 } }),
}));

vi.mock('@/features/auth/api/use-get-user', () => ({
  useGetUser: () => ({ data: undefined }),
}));

vi.mock('@/features/chat/hook/use-is-from-app', () => ({
  default: () => false,
}));

vi.mock('@/features/chat/hook/use-send-message', () => ({
  default: () => mocks.sendMessage,
}));

vi.mock('@/features/chat/store/hair-consultation-chat-channel-store', () => ({
  useHairConsultationChatChannelStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      userHairConsultationChatChannels: mocks.userChannels,
      updateChannelUserInfo: mocks.updateChannelUserInfo,
      resetUnreadCount: mocks.resetUnreadCount,
      subscribeToMine: mocks.subscribeToMine,
    }),
}));

vi.mock('@/features/chat/store/hair-consultation-chat-message-store', () => ({
  useHairConsultationChatMessageStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      subscribeToMessages: mocks.subscribeToMessages,
      loading: false,
      clearMessages: mocks.clearMessages,
    }),
}));

vi.mock('@/features/chat/ui/chat-detail-more-button', () => ({
  default: () => <div data-testid="chat-detail-more-button" />,
}));

vi.mock('@/features/chat/ui/chat-message-form', () => ({
  default: ({ onSubmit }: { onSubmit: (data: { content: string }) => Promise<unknown> }) => (
    <button type="button" onClick={() => void onSubmit({ content: '안녕하세요' })}>
      메시지 입력
    </button>
  ),
}));

vi.mock('@/features/chat/ui/chat-post-buttons', () => ({
  default: () => <div data-testid="chat-post-buttons" />,
}));

vi.mock('@/features/chat/ui/message-section', () => ({
  default: () => <div data-testid="message-section" />,
}));

vi.mock('@/shared/context/loading-context', () => ({
  useLoadingContext: () => ({ setLoading: mocks.setLoading }),
}));

vi.mock('@/shared/hooks/use-router-with-user', () => ({
  useRouterWithUser: () => ({ back: mocks.back }),
}));

vi.mock('@/shared/lib/app-bridge', () => ({
  closeAppWebView: mocks.closeAppWebView,
}));

vi.mock('@/widgets/header', () => ({
  SiteHeader: ({ title }: { title: string }) => <header>{title}</header>,
}));

const activeChannel = {
  channelId: 'channel-1',
  schemaVersion: 2,
  userId: '1',
  otherUserId: '2',
  otherUser: { id: 2, DisplayName: '상대 디자이너' },
  otherUserLeft: false,
  deletedAt: null,
  unreadCount: 0,
  isBlockChannel: false,
  lastMessage: {},
  isPinned: false,
  pinnedAt: null,
  lastReadAt: null,
  createdAt: {},
  updatedAt: {},
};

describe('HairConsultationChatDetailPage read-only wiring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.userChannels = [{ ...activeChannel }];
    mocks.sendMessage.mockResolvedValue({ success: true, channelId: 'channel-1' });
  });

  it('상대방 이탈 메타가 갱신되면 메시지는 유지하고 입력창을 안내문으로 교체한다', async () => {
    const view = render(<HairConsultationChatDetailPage />);

    expect(await screen.findByRole('button', { name: '메시지 입력' })).toBeTruthy();
    expect(screen.getByTestId('message-section')).toBeTruthy();
    expect(mocks.subscribeToMine).toHaveBeenCalledWith('channel-1', '1');

    mocks.userChannels = [{ ...activeChannel, otherUserLeft: true }];
    view.rerender(<HairConsultationChatDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('상대방이 나간 채팅방입니다.')).toBeTruthy();
      expect(screen.queryByRole('button', { name: '메시지 입력' })).toBeNull();
    });
    expect(screen.getByTestId('message-section')).toBeTruthy();
  });

  it('전송 중 상대방 이탈을 감지하면 이후 입력을 막고 안내문을 표시한다', async () => {
    mocks.sendMessage.mockResolvedValue({
      success: false,
      channelId: null,
      errorCode: HAIR_CONSULTATION_CHAT_MESSAGE_SEND_UNAVAILABLE_ERROR,
    });

    render(<HairConsultationChatDetailPage />);

    fireEvent.click(await screen.findByRole('button', { name: '메시지 입력' }));

    await waitFor(() => {
      expect(screen.getByText('상대방이 나간 채팅방입니다.')).toBeTruthy();
      expect(screen.queryByRole('button', { name: '메시지 입력' })).toBeNull();
    });
    expect(mocks.sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        channelId: 'channel-1',
        receiverId: '2',
        message: '안녕하세요',
      }),
    );
  });
});
