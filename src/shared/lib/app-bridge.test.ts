import { afterEach, describe, expect, it, vi } from 'vitest';

import { openInAppWebView } from './app-bridge';

type TestBridgeWindow = Window & {
  GoAppRouter?: {
    postMessage: (value: string) => void;
  };
  goAppRouter?: (payload: string) => void;
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
