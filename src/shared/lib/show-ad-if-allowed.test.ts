import { afterEach, describe, expect, it, vi } from 'vitest';

import { showAdIfAllowed } from './show-ad-if-allowed';

describe('showAdIfAllowed', () => {
  afterEach(() => {
    Reflect.deleteProperty(window, 'showAdIfAllowed');
  });

  it('광고 완료 후 WebView 닫기 옵션을 네이티브 래퍼에 전달한다', () => {
    const nativeWrapper = vi.fn();
    window.showAdIfAllowed = nativeWrapper;

    showAdIfAllowed({
      adType: 'creating-experience-group',
      closeWebViewOnCompletion: true,
    });

    expect(nativeWrapper).toHaveBeenCalledWith({
      adType: 'creating-experience-group',
      closeWebViewOnCompletion: true,
    });
  });
});
