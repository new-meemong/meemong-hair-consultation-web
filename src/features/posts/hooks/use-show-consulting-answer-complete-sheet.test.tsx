import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { MongRewardPreset } from '@/entities/mong/api/mong-reward-preset';
import { apiClient } from '@/shared/api/client';
import { OverlayProvider } from '@/shared/context/overlay-context';

import useShowConsultingAnswerCompleteSheet from './use-show-consulting-answer-complete-sheet';

vi.mock('@/shared/api/client', () => ({
  apiClient: { getList: vi.fn() },
}));

vi.mock('@/shared/ui/bottom-sheet', () => ({
  BottomSheet: ({ children, open }: { children?: ReactNode; open: boolean }) =>
    open ? <div data-testid="bottom-sheet">{children}</div> : null,
}));

vi.mock('@/shared/ui/drawer', () => ({
  DrawerClose: ({ children }: { children: ReactNode }) => <>{children}</>,
  DrawerDescription: ({ children }: { children: ReactNode }) => <p>{children}</p>,
  DrawerFooter: ({ buttons }: { buttons: ReactNode[] }) => <div>{buttons}</div>,
  DrawerHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DrawerTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
}));

vi.mock('@/shared/ui/button', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock('@/shared/ui/snack-bar', () => ({
  SNACK_BAR_ANIMATION_DURATION: 0,
  SnackBar: () => null,
}));

vi.mock('@/shared/ui/modal-wrapper', () => ({
  ModalWrapper: () => null,
}));

const rewardPresets: MongRewardPreset[] = [
  {
    id: 1,
    code: 'HAIR_CONSULTATIONS_ANSWER_EVENT',
    title: '이미지 포함',
    description: '',
    isActive: true,
    rewardType: 'MONG',
    rewardAmount: 6,
    repeatType: 'ID',
    repeatCount: 1,
    createdAt: '2026-09-03T00:00:00.000Z',
    updatedAt: '2026-09-03T00:00:00.000Z',
  },
  {
    id: 2,
    code: 'HAIR_CONSULTATIONS_ANSWER_EVENT_MISSING_STYLE_IMAGE',
    title: '이미지 미포함 · 성실작성',
    description: '',
    isActive: true,
    rewardType: 'MONG',
    rewardAmount: 3,
    repeatType: 'ID',
    repeatCount: 1,
    createdAt: '2026-09-03T00:00:00.000Z',
    updatedAt: '2026-09-03T00:00:00.000Z',
  },
  {
    id: 3,
    code: 'HAIR_CONSULTATIONS_ANSWER_EVENT_SHORT_STYLE_DESCRIPTION',
    title: '이미지 미포함 · 성실작성 X',
    description: '',
    isActive: true,
    rewardType: 'MONG',
    rewardAmount: 0,
    repeatType: 'ID',
    repeatCount: 1,
    createdAt: '2026-09-03T00:00:00.000Z',
    updatedAt: '2026-09-03T00:00:00.000Z',
  },
];

function CompleteSheetTrigger() {
  const showCompleteSheet = useShowConsultingAnswerCompleteSheet();

  return (
    <button
      type="button"
      onClick={() => showCompleteSheet({ eventMongData: null, onNavigate: vi.fn() })}
    >
      완료 시트 열기
    </button>
  );
}

function renderWithProductionProviderOrder() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const renderResult = render(
    <OverlayProvider>
      <QueryClientProvider client={queryClient}>
        <CompleteSheetTrigger />
      </QueryClientProvider>
    </OverlayProvider>,
  );

  return { ...renderResult, queryClient };
}

describe('useShowConsultingAnswerCompleteSheet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiClient.getList).mockResolvedValue({
      dataList: rewardPresets,
      dataCount: rewardPresets.length,
    });
  });

  it('프리셋 재조회가 실패하면 전역 Provider 밖에서도 확인 불가 상태를 렌더한다', async () => {
    vi.mocked(apiClient.getList).mockRejectedValue(new Error('preset load failed'));
    renderWithProductionProviderOrder();

    await waitFor(() => expect(apiClient.getList).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole('button', { name: '완료 시트 열기' }));
    fireEvent.click(screen.getByRole('button', { name: '리워드 기준보기' }));

    await waitFor(() => expect(apiClient.getList).toHaveBeenCalledTimes(2));
    expect(await screen.findAllByText('확인 불가')).toHaveLength(3);
  });

  it('성공 캐시가 있으면 시트 재조회 실패 후에도 마지막 서버 금액을 유지한다', async () => {
    vi.mocked(apiClient.getList)
      .mockResolvedValueOnce({
        dataList: rewardPresets,
        dataCount: rewardPresets.length,
      })
      .mockRejectedValueOnce(new Error('preset refetch failed'));
    const { queryClient } = renderWithProductionProviderOrder();

    await waitFor(() =>
      expect(queryClient.getQueryData(['mong-reward-presets', { isActive: true }])).toBeDefined(),
    );
    fireEvent.click(screen.getByRole('button', { name: '완료 시트 열기' }));
    fireEvent.click(screen.getByRole('button', { name: '리워드 기준보기' }));

    await waitFor(() => expect(apiClient.getList).toHaveBeenCalledTimes(2));
    expect(await screen.findByText('6몽')).toBeTruthy();
    expect(screen.queryAllByText('확인 불가')).toHaveLength(0);
  });
});
