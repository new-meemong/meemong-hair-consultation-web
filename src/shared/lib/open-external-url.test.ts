import { afterEach, describe, expect, it, vi } from 'vitest';

import { openExternalUrl } from './open-external-url';

type TestBridgeWindow = Window & {
  ExternalLink?: {
    postMessage: (value: string) => void;
  };
  externalLink?: (url: string) => void;
};

const bridgeWindow = window as TestBridgeWindow;

describe('openExternalUrl', () => {
  afterEach(() => {
    Reflect.deleteProperty(bridgeWindow, 'ExternalLink');
    Reflect.deleteProperty(window, 'externalLink');
    vi.restoreAllMocks();
  });

  it('uses the native bridge without opening a browser tab', () => {
    const externalLink = vi.fn();
    const postMessage = vi.fn();
    const open = vi.spyOn(window, 'open');

    bridgeWindow.externalLink = externalLink;
    bridgeWindow.ExternalLink = { postMessage };

    openExternalUrl('https://naver.com');

    expect(externalLink).toHaveBeenCalledWith('https://naver.com');
    expect(postMessage).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
  });

  it('opens a new browser tab when only the layout wrapper exists', () => {
    const externalLink = vi.fn();
    const open = vi.spyOn(window, 'open').mockReturnValue(null);

    bridgeWindow.externalLink = externalLink;

    openExternalUrl('https://naver.com');

    expect(externalLink).not.toHaveBeenCalled();
    expect(open).toHaveBeenCalledWith('https://naver.com', '_blank', 'noopener,noreferrer');
  });
});
