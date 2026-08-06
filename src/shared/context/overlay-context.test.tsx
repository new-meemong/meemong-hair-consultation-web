import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { OverlayProvider, useOverlayContext } from './overlay-context';

vi.mock('@/shared/ui/snack-bar', () => ({
  SNACK_BAR_ANIMATION_DURATION: 0,
  SnackBar: ({ message }: { message: string }) => <div role="alert">{message}</div>,
}));

vi.mock('@/shared/ui/bottom-sheet', () => ({
  BottomSheet: () => null,
}));

vi.mock('../ui/modal-wrapper', () => ({
  ModalWrapper: () => null,
}));

function SnackBarTestTrigger() {
  const { showSnackBar } = useOverlayContext();

  return (
    <button
      type="button"
      onClick={() => showSnackBar({ type: 'success', message: '업로드가 완료되었습니다!' })}
    >
      토스트 표시
    </button>
  );
}

describe('OverlayProvider', () => {
  const originalRandomUuid = globalThis.crypto.randomUUID;

  afterEach(() => {
    Object.defineProperty(globalThis.crypto, 'randomUUID', {
      configurable: true,
      value: originalRandomUuid,
    });
  });

  it('crypto.randomUUID를 지원하지 않는 로컬 HTTP WebView에서도 토스트를 표시한다', () => {
    Object.defineProperty(globalThis.crypto, 'randomUUID', {
      configurable: true,
      value: undefined,
    });

    render(
      <OverlayProvider>
        <SnackBarTestTrigger />
      </OverlayProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: '토스트 표시' }));

    expect(screen.getByRole('alert').textContent).toBe('업로드가 완료되었습니다!');
  });
});
