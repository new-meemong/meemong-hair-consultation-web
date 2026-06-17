import { afterEach, describe, expect, it, vi } from 'vitest';

import { openExternalLinkInApp, openInAppWebView } from './app-bridge';

type TestBridgeWindow = Window & {
  GoAppRouter?: {
    postMessage: (value: string) => void;
  };
  goAppRouter?: (payload: string) => void;
  ExternalLink?: {
    postMessage: (value: string) => void;
  };
  externalLink?: (url: string) => void;
};

const bridgeWindow = window as TestBridgeWindow;

describe('openInAppWebView', () => {
  afterEach(() => {
    Reflect.deleteProperty(bridgeWindow, 'GoAppRouter');
    Reflect.deleteProperty(window, 'goAppRouter');
  });

  it('returns false when only the layout wrapper exists', () => {
    bridgeWindow.goAppRouter = vi.fn();

    expect(openInAppWebView('/hair-consultation/posts/1')).toBe(false);
    expect(bridgeWindow.goAppRouter).not.toHaveBeenCalled();
  });

  it('ignores options and uses the wrapper with a string path for backward compatibility', () => {
    const goAppRouter = vi.fn();
    const postMessage = vi.fn();

    bridgeWindow.goAppRouter = goAppRouter;
    bridgeWindow.GoAppRouter = { postMessage };

    expect(
      openInAppWebView('/hair-consultation/posts/1', {
        reloadOnReturn: false,
      }),
    ).toBe(true);
    expect(goAppRouter).toHaveBeenCalledWith('/hair-consultation/posts/1');
    expect(postMessage).not.toHaveBeenCalled();
  });

  it('ignores options and falls back to the native channel with a string payload', () => {
    const postMessage = vi.fn();

    bridgeWindow.GoAppRouter = { postMessage };

    expect(
      openInAppWebView('/hair-consultation/experience-groups/1', {
        reloadOnReturn: false,
      }),
    ).toBe(true);
    expect(postMessage).toHaveBeenCalledWith(
      JSON.stringify('/hair-consultation/experience-groups/1'),
    );
  });
});

describe('openExternalLinkInApp', () => {
  afterEach(() => {
    Reflect.deleteProperty(bridgeWindow, 'ExternalLink');
    Reflect.deleteProperty(window, 'externalLink');
  });

  it('returns false when only the layout wrapper exists', () => {
    bridgeWindow.externalLink = vi.fn();

    expect(openExternalLinkInApp('https://naver.com')).toBe(false);
    expect(bridgeWindow.externalLink).not.toHaveBeenCalled();
  });

  it('uses the wrapper when the native channel exists', () => {
    const externalLink = vi.fn();
    const postMessage = vi.fn();

    bridgeWindow.externalLink = externalLink;
    bridgeWindow.ExternalLink = { postMessage };

    expect(openExternalLinkInApp('https://naver.com')).toBe(true);
    expect(externalLink).toHaveBeenCalledWith('https://naver.com');
    expect(postMessage).not.toHaveBeenCalled();
  });

  it('falls back to the native channel', () => {
    const postMessage = vi.fn();

    bridgeWindow.ExternalLink = { postMessage };

    expect(openExternalLinkInApp('https://naver.com')).toBe(true);
    expect(postMessage).toHaveBeenCalledWith(JSON.stringify('https://naver.com'));
  });
});
