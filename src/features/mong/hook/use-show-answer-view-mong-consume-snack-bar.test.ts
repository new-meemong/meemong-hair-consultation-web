import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

import type { MongConsumePresetPaymentResult } from '@/entities/mong/api/mong-consume-preset';
import useShowAnswerViewMongConsumeSnackBar from './use-show-answer-view-mong-consume-snack-bar';

const mockShowSnackBar = vi.fn();

vi.mock('@/shared/context/overlay-context', () => ({
  useOverlayContext: () => ({ showSnackBar: mockShowSnackBar }),
}));

const paidPreset: MongConsumePresetPaymentResult = {
  id: 1,
  title: '내가 쓴 게시물 헤어컨설팅 답변 보기',
  type: 'HAIR_CONSULTING',
  subType: 'VIEW_MY_HAIR_CONSULTATIONS_ANSWERS_MODEL',
  price: 30,
  createdAt: '2026-07-31T00:00:00.000Z',
  updatedAt: '2026-07-31T00:00:00.000Z',
  deletedAt: null,
  isPaidThisTime: true,
};

describe('useShowAnswerViewMongConsumeSnackBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('현재 화면에서 완료된 상세 조회가 실제 차감됐으면 성공 토스트를 표시한다', () => {
    const { rerender } = renderHook(
      ({ dataUpdatedAt }) =>
        useShowAnswerViewMongConsumeSnackBar({
          dataUpdatedAt,
          mongConsumePreset: paidPreset,
        }),
      { initialProps: { dataUpdatedAt: 0 } },
    );

    rerender({ dataUpdatedAt: 100 });

    expect(mockShowSnackBar).toHaveBeenCalledOnce();
    expect(mockShowSnackBar).toHaveBeenCalledWith({
      type: 'success',
      message: '30몽을 사용해 컨설팅 답변을 확인했어요',
    });
  });

  it('캐시에 남아 있던 과거 차감 결과는 다시 표시하지 않는다', () => {
    renderHook(() =>
      useShowAnswerViewMongConsumeSnackBar({
        dataUpdatedAt: 100,
        mongConsumePreset: paidPreset,
      }),
    );

    expect(mockShowSnackBar).not.toHaveBeenCalled();
  });

  it('이번 상세 조회에서 차감하지 않았으면 표시하지 않는다', () => {
    const { rerender } = renderHook(
      ({ dataUpdatedAt }) =>
        useShowAnswerViewMongConsumeSnackBar({
          dataUpdatedAt,
          mongConsumePreset: {
            ...paidPreset,
            isPaidThisTime: false,
          },
        }),
      { initialProps: { dataUpdatedAt: 0 } },
    );

    rerender({ dataUpdatedAt: 100 });

    expect(mockShowSnackBar).not.toHaveBeenCalled();
  });
});
