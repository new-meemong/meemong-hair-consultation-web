import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { MongRewardPreset } from '@/entities/mong/api/mong-reward-preset';
import { apiClient } from '@/shared/api/client';
import { OverlayProvider } from '@/shared/context/overlay-context';

import useShowConsultingAnswerCompleteSheet from './use-show-consulting-answer-complete-sheet';

vi.mock('@/shared/api/client', () => ({
  apiClient: { getList: vi.fn() },
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

function CompleteSheetTrigger({ onNavigate }: { onNavigate: () => void }) {
  const showCompleteSheet = useShowConsultingAnswerCompleteSheet();

  return (
    <button type="button" onClick={() => showCompleteSheet({ eventMongData: null, onNavigate })}>
      완료 시트 열기
    </button>
  );
}

function renderCompleteSheet(onNavigate: () => void) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <OverlayProvider>
      <QueryClientProvider client={queryClient}>
        <CompleteSheetTrigger onNavigate={onNavigate} />
      </QueryClientProvider>
    </OverlayProvider>,
  );
}

function getDrawerOverlay(dialogName: string) {
  const dialog = screen.getByRole('dialog', { name: dialogName });
  const overlay = dialog.previousElementSibling;
  if (!(overlay instanceof HTMLButtonElement) || overlay.dataset.slot !== 'drawer-overlay') {
    throw new Error(`${dialogName} 바텀시트의 딤 영역을 찾을 수 없습니다.`);
  }
  return overlay;
}

describe('useShowConsultingAnswerCompleteSheet 실제 BottomSheet 전환', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiClient.getList).mockResolvedValue({
      dataList: rewardPresets,
      dataCount: rewardPresets.length,
    });
  });

  it('기준보기 전환 중에는 이동하지 않고 기준 시트를 닫을 때 이동한다', async () => {
    const onNavigate = vi.fn();
    renderCompleteSheet(onNavigate);

    await waitFor(() => expect(apiClient.getList).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole('button', { name: '완료 시트 열기' }));
    expect(await screen.findByText('컨설팅 작성이 완료되었습니다!')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '리워드 기준보기' }));

    expect(await screen.findByText('리워드 지급 기준')).toBeTruthy();
    expect(await screen.findByText('6몽')).toBeTruthy();
    expect(screen.getByText('3몽')).toBeTruthy();
    expect(screen.getByText('0몽')).toBeTruthy();
    await waitFor(() => expect(screen.queryByText('컨설팅 작성이 완료되었습니다!')).toBeNull());
    expect(onNavigate).not.toHaveBeenCalled();

    fireEvent.click(getDrawerOverlay('리워드 지급 기준'));
    await waitFor(() => expect(onNavigate).toHaveBeenCalledOnce());
  });

  it('완료 시트를 딤 영역으로 닫아도 화면을 이동한다', async () => {
    const onNavigate = vi.fn();
    renderCompleteSheet(onNavigate);

    await waitFor(() => expect(apiClient.getList).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole('button', { name: '완료 시트 열기' }));
    expect(await screen.findByText('컨설팅 작성이 완료되었습니다!')).toBeTruthy();

    fireEvent.click(getDrawerOverlay('컨설팅 작성이 완료되었습니다!'));

    await waitFor(() => expect(onNavigate).toHaveBeenCalledOnce());
  });
});
