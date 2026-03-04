export type AppSource = 'app' | 'web';

type BridgeWindow = Window & {
  GoAppRouter?: {
    postMessage: (value: string) => void;
  };
  GoBack?: {
    postMessage: (value: string) => void;
  };
};

export function normalizeSource(source: string | null | undefined): AppSource {
  return source === 'app' ? 'app' : 'web';
}

function hasGoAppRouterBridge(): boolean {
  if (typeof window === 'undefined') return false;

  const w = window as BridgeWindow;
  return (
    typeof w.goAppRouter === 'function' ||
    (!!w.GoAppRouter && typeof w.GoAppRouter.postMessage === 'function')
  );
}

function hasCloseWebViewBridge(): boolean {
  if (typeof window === 'undefined') return false;

  const w = window as BridgeWindow;
  return (
    typeof w.closeWebview === 'function' ||
    (!!w.GoBack && typeof w.GoBack.postMessage === 'function')
  );
}

export function openInAppWebView(path: string): boolean {
  if (!hasGoAppRouterBridge()) return false;

  try {
    const w = window as BridgeWindow;
    if (typeof w.goAppRouter === 'function') {
      w.goAppRouter(path);
      return true;
    }

    w.GoAppRouter?.postMessage(JSON.stringify(path));
    return true;
  } catch (_) {
    return false;
  }
}

export function closeAppWebView(message: string = 'close'): boolean {
  if (!hasCloseWebViewBridge()) return false;

  try {
    const w = window as BridgeWindow;
    if (typeof w.closeWebview === 'function') {
      w.closeWebview(message);
      return true;
    }

    w.GoBack?.postMessage(JSON.stringify(message));
    return true;
  } catch (_) {
    return false;
  }
}
